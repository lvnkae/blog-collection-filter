/*!
 *  @brief  content.js本体
 */
class Content {

    initialize() {
        // background用Listener
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponce)=> {
                if (request.command == MessageUtil.command_update_storage()) {
                    this.storage.load().then();
                } else
                if (request.command == MessageUtil.command_mute_blog_url()) {
                    const update
                        = this.storage.add_blog_url_mute_with_check(request.blog_url,
                                                                    request.blog);
                    if (update && request.tab_active) {
                        this.storage.save();
                        if (this.storage.json.active) {
                            this.filter_instance.clear_marker();
                            this.filter_instance.filtering();
                        }
                    }
                }
                return true;
            }
        );
    }

    callback_domloaded() {
        const loc = new urlWrapper(location.href);
        if (loc.in_livedoor()) {
            this.filter_instance = new LivedoorFilter(this.storage);
        } else if (loc.in_blogmura()) {
            this.filter_instance = new BlogmuraFilter(this.storage);
        } else if (loc.in_with2()) {
            this.filter_instance = new With2Filter(this.storage);
        } else {
            return;
        }
        //
        this.filter_instance.callback_domloaded();
    }

    load() {
        this.storage = new StorageData();
        this.storage.load().then(() => {
            this.storage_loaded = true;
            if (this.dom_content_loaded) {
                this.callback_domloaded();
            }
        });
    }

    kick() {
        MessageUtil.send_message({command:MessageUtil.command_start_content()});
        this.load();
    }

    constructor() {
        this.filter_instance = null;
        this.storage_loaded = false;
        this.dom_content_loaded = false;
        //
        this.initialize();
        this.kick();
        document.addEventListener("DOMContentLoaded", ()=> {
            this.dom_content_loaded = true;
            if (this.storage_loaded) {
                this.callback_domloaded();
            }
        });
    }
}


var gContent = new Content();
