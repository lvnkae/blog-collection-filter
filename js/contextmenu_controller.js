/*!
 *  @brief  右クリックメニュー制御(ベース)
 */
class ContextMenuController {

    /*!
     *  @brief  各種バッファのクリア
     */
    clear() {
        this.monitoring_target = null;
        this.monitoring_target_base = {length:0};
        this.context_menu =  { blog_name:null, blog_url:null };
    }

    /*!
     *  @brief  右クリックメニューの「$(channel)をミュート」を有効化
     *  @param  element
     */
    on_mute_menu(element) {
        const blog_name = this.get_blog_name(element);
        const blog_url = this.get_blog_url(element);
        if (blog_name == null || blog_url == null) {
            return false;
        }
        if (blog_name == this.context_menu.blog_name) {
            return true; // 前回と同じなので不要
        }
        this.context_menu.blog_name = blog_name;
        this.context_menu.blog_url = blog_url;
        const blog_name_str = blog_name.slice(0, StorageJSON.MAX_LEN_COMMENT);
        const title = blog_name_str + "をミュート";
        MessageUtil.send_message({
            command: MessageUtil.command_update_contextmenu(),
            click_command: MessageUtil.command_mute_blog_url(),
            title: title,
            blog_url: blog_url,
            blog_name: blog_name_str
        });
        return true;
    }
    /*!
     *  @brief  右クリックメニューの拡張機能固有項目を無効化
     */
    off_original_menu() {
        if (null == this.context_menu.blog_name) {
            return true; // 前回と同じなので不要
        }
        this.context_menu.blog_name = null;
        this.context_menu.blog_url = null;
        MessageUtil.send_message({
            command: MessageUtil.command_update_contextmenu(),
        });
    }

    update_context_menu() {
        if (this.filter_active) {
            if (this.monitoring_target_base.length > 0 &&
                this.on_mute_menu(this.monitoring_target_base)) {
                return;
            }
        }
        this.off_original_menu();
    }

    enable_original_menu(doc) {
        // 右クリックListener
        // 'contextmenu'では間に合わない
        // 'mouseup'でも間に合わないことがある(togetterのみ確認)
        // しかもMacOSでは右mouseupが発火しない(宗教が違う)らしい
        // よって
        //   'mousedown' 右ボタン押下時にcontextmenuをupdate
        //   'mousemove' 右ボタン押下+移動してたらtargetの変化を監視し再update
        // の2段Listener体制でねじ込む
        // ※service_workerでは'mousedown'でも間に合わないタイミングがある
        // ※cf.破棄→再生成直後(確定で間に合わない)
        // ※'mousemove'で監視対象が変化したら即updateするようにしてみる
        doc.addEventListener('mousemove', (e) => {
            if (e.target == this.monitoring_target) {
                return;
            }
            const base_node = this.get_base_node(e.target);
            if (base_node[0] == this.monitoring_target_base[0]) {
                return;
            }
            this.monitoring_target = e.target;
            this.monitoring_target_base = base_node;
            this.update_context_menu();
        });
    }


    constructor(active) {
        this.filter_active = active;
        this.monitoring_target = null;
        this.monitoring_target_base = {length:0};
        this.context_menu =  { blog_name:null, blog_url:null };
        this.enable_original_menu(document);
    }
}
