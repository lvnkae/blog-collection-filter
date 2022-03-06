/*!
 *  @brief  messageユーティリティクラス
 */
class MessageUtil {
    /*!
     *  @brief  backgroundへのsendMessage
     *  @param  message
     *  @note   環境依存するのでラップしとく
     */
    static send_message(message) {
        chrome.runtime.sendMessage(message);
    }

    static command_open_popup() { return "open_popup"; }
    static command_update_storage() { return "update_storage"; }
    static command_update_contextmenu() { return "update_contextmenu"; }
    static command_mute_blog_url() { return "mute_blog_url"; }
}
