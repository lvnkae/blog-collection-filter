/*!
 *  @brief  click時にfrontへ送り返すミュート対象情報
 *  @note   v3対応でinstance化できなくなったのでstorageに入れる
 *  @note   (global-workも併用)
 */
class MuteBlogParam {
    constructor(click_command = '', url = '', name = '') {
        this.click_command = click_command;
        this.blog_url = url;
        this.blog_name = name;
    }
}

/*!
 *  @brief  右クリックメニュー制御(background側)
 *  @note   v3対応でinstance化できなくなったので全部static
 */
class BGContextMenuController {

    static CONTEXT_MENUS_ID = "BlogCollectionFilter1.0.0";

    /*!
     *  @brief  onMessageコールバック
     *  @param  request
     */
    static on_message(request) {
        if (request.title == null) {
            //console.log("dispoff(null) " + performance.now());
            chrome.contextMenus.update(BGContextMenuController.CONTEXT_MENUS_ID, { 
                "visible": false
            });
        } else {
            //console.log("update " + request.title + " " + performance.now());
            gMuteBlogParam = new MuteBlogParam(request.click_command,
                                               request.blog_url,
                                               request.blog_name);
            // service_workerが破棄されたときのためにstorageに書いておく
            {
                var mute_obj = {};
                mute_obj[BGContextMenuController.CONTEXT_MENUS_ID] = gMuteBlogParam;
                //console.log("save " + performance.now());
                chrome.storage.local.set(mute_obj, ()=> {
                    //console.log("save-end " + performance.now());
                });
            }
            chrome.contextMenus.update(BGContextMenuController.CONTEXT_MENUS_ID, {
                "title": request.title,
                "visible": true
            });
        }                                                
    }

    /*!
     *  @brief  固有右クリックメニュー登録
     */
    static create_menu() {
        // 拡張機能IDをitem_idとする(unique保証されてるので)
        //console.log("create " + performance.now());
        chrome.contextMenus.create({
            "title": "<null>",
            "id": BGContextMenuController.CONTEXT_MENUS_ID,
            "type": "normal",
            "contexts" : ["all"],
            "visible" : false
        }, () => { chrome.runtime.lastError; });
    }

    static add_listener() {
        //console.log("add onClickeed-listener" + performance.now());
        chrome.contextMenus.onClicked.addListener((info)=> {
            //console.log("clicked " + performance.now());
            if (info.menuItemId != BGContextMenuController.CONTEXT_MENUS_ID) {
                return;
            }
            const click_command = gMuteBlogParam.click_command;
            if (click_command == MessageUtil.command_mute_blog_url()) {
                BGMessageSender.send_reply(
                    {command: click_command,
                     blog_url: gMuteBlogParam.blog_url,
                     blog_name: gMuteBlogParam.blog_name}, false);
            }
        });
    }
}

var gMuteBlogParam = new MuteBlogParam();
//console.log("load " + performance.now());
chrome.storage.local.get(BGContextMenuController.CONTEXT_MENUS_ID, (item) => {
    //console.log("load-end " + performance.now());
    if (item != null) {
        // update(storage.local.set)とニアミスすることがある
        // ('timeoutでservice_worker破棄→mousemove[update]で復帰'パターン)
        // 万が一の場合はupdateを優先し既に有効値が書き込まれてたら弾く
        if (gMuteBlogParam.blog_url == '') {
            //console.log("overwrite-mute-param " + performance.now());
            gMuteBlogParam = item[BGContextMenuController.CONTEXT_MENUS_ID];
        }
    }
});
