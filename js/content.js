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
                if (request.command == MessageUtil.command_open_popup()) {
                    // popupが開いたらcontextMenuを消しとく
                    if (this.filter_instance != null) {
                        this.filter_instance.clear_context_menu();
                    }
                    MessageUtil.send_message({
                        command: MessageUtil.command_update_contextmenu()
                    });
                } else
                if (request.command == MessageUtil.command_mute_blog_url()) {
                    const update
                        = this.storage.add_blog_url_mute_with_check(request.blog_url,
                                                                    request.blog_name);
                    if (update && request.tab_active) {
                        this.storage.save();
                        if (this.storage.is_filter_active()) {
                            this.filter_instance.clear_marker();
                            this.filter_instance.filtering();
                        }
                    }
                }
                return true;
            }
        );
    }

    create_filter() {
        if (this.filter_instance != null) {
            return;
        }
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
    }

    callback_domloaded() {
        this.create_filter();
        if (this.filter_instance != null) {
            this.filter_instance.callback_domloaded();
        }
    }

    load() {
        this.storage = new StorageData();
        this.storage.load().then(() => {
            this.storage_loaded = true;
            if (this.dom_content_loaded) {
                this.callback_domloaded();
            } else {
                // DOM構築完了前にもフィルタをかけてみる
                this.create_filter();
                if (this.filter_instance != null) {
                    this.filter_instance.call_filtering();
                    this.filter_instance.start_element_observer();
                }
            }
        });
    }

    kick() {
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
        document.addEventListener('visibilitychange', ()=> {
            if (document.visibilityState === 'visible') {
                if (this.filter_instance != null) {
                    this.filter_instance.clear_context_menu();
                }
            } else {
                // focusを失ったらcontextMenuを消しとく
                MessageUtil.send_message(
                    {command: MessageUtil.command_update_contextmenu()});
            }
        });
        window.addEventListener('beforeunload', ()=> {
            // URL遷移するならcontextMenuを消す
            MessageUtil.send_message(
                {command: MessageUtil.command_update_contextmenu()});
        });
    }
}


var gContent = new Content();
