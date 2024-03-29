/*!
 *  @brief  message送信クラス(background側)
 */
class BGMessageSender {
    /*!
     *  @brief  返信
     *  @param  message     メッセージ
     *  @param  b_active    アクティブなタブにのみ送るか？
     */
    static send_reply(message, b_active = true) {
        chrome.tabs.query({}, (tabs)=> {
            for (const tab of tabs) {
                if (b_active && !tab.active) {
                    continue;
                }
                // note
                // responseを設定するとerror
                //   "The message port closed before a response was received."
                // → 応答不要なのでnullにしておく
                message.tab_active = tab.active;
                chrome.tabs.sendMessage(tab.id, message, null); 
            }
        });
    }
}
