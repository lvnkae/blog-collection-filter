/*!
 *  @brief  message送信クラス(background側)
 *  @note   継承して使う
 */
class BGMessageSender {
    //
    constructor() {
        this.connected_tab = [];
    }

    /*!
     *  @brief  タブ登録
     *  @param  tab_id          タブID
     *  @note   返信は登録されたタブにのみ行う
     */
    entry(tab_id) {
        this.connected_tab[tab_id] = null;
    }
    /*!
     *  @brief  登録されたタブか
     */
    is_connected_tab(tab_id) {
        return tab_id in this.connected_tab;
    }

    /*!
     *  @brief  返信
     *  @param  message     メッセージ
     *  @param  tab_ids     返信対象タブID群
     *  @param  b_active    アクティブなタブにのみ送るか？
     *  @note   登録されているタブにのみ送信
     */
    send_reply(message, tab_ids, b_active) {
        chrome.tabs.query({}, (tabs)=> {
            for (const tab of tabs) {
                if (tab.id in this.connected_tab) {
                    if (b_active && !tab.active) {
                        continue;
                    }
                    if (tab_ids) {
                        if (tab.id in tab_ids) {
                        } else {
                            continue;
                        }
                    }
                    // note
                    // responseを設定するとerror
                    //   "The message port closed before a response was received."
                    // → 応答不要なのでnullにしておく
                    message.tab_active = tab.active;
                    chrome.tabs.sendMessage(tab.id, message, null); 
                }
            }
        });
    }
 }
