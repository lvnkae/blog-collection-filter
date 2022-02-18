/*!
 *  @brief  バッジ(拡張機能入れるとchromeメニューバーに出るアイコン)管理クラス
 */
class Badge  {

    constructor() {
        // 右クリックメニューが残ってしまうので非表示指示を出しとく
        MessageUtil.send_message({
            command: MessageUtil.command_update_contextmenu(),
        });
    }
    
    update(storage) {
        if (storage.json.active) {
            chrome.browserAction.setIcon({ path : "../img/badge_on.png"});
        } else {
            chrome.browserAction.setIcon({ path : "../img/badge_off.png"});
        }
    }
};

/*!
 */
class BlogFilterParam {
    constructor(text, comment) {
        this.black_titles = text;
        this.comment = comment.slice(0, StorageJSON.MAX_LEN_COMMENT);
    }
};



/*!
 *  @brief  popup.js本体
 */
class Popup {

    constructor() {
        this.initialize();
    }

    initialize() {
        this.badge = new Badge();
        this.storage = new StorageData();
        this.storage.load().then(()=> {
            this.updateCheckbox();
            this.updateTextarea();
            this.badge.update(this.storage);
        });
        this.ex_blog_buffer = [];        // 非表示ブログ詳細設定バッファ(各種フラグ/個別非表示タイトル)
        this.ex_blog_last = '';          // 最後に「非表示チャンネル詳細設定」画面を開いたブログ名
        //
        this.checkbox_sw_filter().change(()=> {
            this.button_save_enable();
        });
        //
        this.selectbox_filter().change(()=> {
            this.selectbox_filter_change();
        });
        //
        this.textarea_filter_blog_url().keyup(()=> {
            this.textarea_filter_blog_url_keyup();
        });
        this.textarea_filter_blog_url().dblclick(()=> {
            this.textarea_filter_blog_url_dblclick();
        });
        this.textarea_filter_blog_entry().keyup(()=> {
            this.textarea_filter_blog_entry_keyup();
        });
        this.textarea_filter_ex_blog_url().keyup(()=> {
            this.textarea_filter_ex_blog_url_keyup();
        });
        this.textbox_blog_name().keyup(()=> {
            this.textbox_blog_name_keyup();
        });
        this.textarea_import_storage().on('paste',(e)=> {
            this.button_import_enable();
        });
        //
        this.button_save().click(()=> {
            this.button_save_click();
        });
        this.button_import().click(()=> {
            this.button_import_click();
        });
    }

    checkbox_sw_filter() {
        return $("input[name=sw_filter]");
    }
    textbox_blog_name() {
        return $("input#blog_name");
    }
    textbox_label_blog_name() {
        return $("label#blog_name");
    }
    textbox_label_blog_name_br() {
        return $("label#blog_name_br");
    }

    textarea_filter_blog_url() {
        return $("textarea[name=filter_blog_url]");
    }
    textarea_filter_blog_entry() {
        return $("textarea[name=filter_blog_entry]");
    }
    textarea_filter_ex_blog_url() {
        return $("textarea[name=filter_ex_blog_url]");
    }
    textarea_export_storage() {
        return $("textarea[name=export_storage]");
    }
    textarea_import_storage() {
        return $("textarea[name=import_storage]");
    }

    button_save() {
        return $("button[name=req_save]");
    }
    button_save_enable() {
        this.button_save().prop("disabled", false);
    }
    button_save_disable() {
        this.button_save().prop("disabled", true);
    }
    button_import() {
        return $("button[name=req_import]");
    }
    button_import_enable() {
        this.button_import().prop("disabled", false);
    }
    button_import_disable() {
        this.button_import().prop("disabled", true);
    }

    hide_textarea_all() {
        this.textarea_filter_blog_url().hide();
        this.textarea_filter_blog_entry().hide();
        this.hide_ex_blog_url();
        this.textarea_export_storage().hide();
        this.textarea_import_storage().hide();
        this.textarea_import_storage().val("");
    }
    hide_ex_blog_url() {
        this.textarea_filter_ex_blog_url().hide();
        this.textbox_blog_name().hide();
        this.textbox_label_blog_name().hide();
        this.textbox_label_blog_name_br().hide();
    }
    show_ex_blog_url() {
        this.textarea_filter_ex_blog_url().show();
        this.textbox_blog_name().show();
        this.textbox_label_blog_name().show();
        this.textbox_label_blog_name_br().show();
    }
    show_export_storage() {
        this.textarea_export_storage().val(this.storage.export());
        this.textarea_export_storage().show();
        this.button_save().hide();
    }
    show_import_storage() {
        this.textarea_import_storage().show();
        this.button_save().hide();
        this.button_import().show();
    }

    textarea_filter_blog_url_keyup() {
        if (this.textarea_filter_blog_url().val() != this.storage.ng_blog_url_text) {
            this.button_save_enable();
        }
    }
    textarea_filter_blog_entry_keyup() {
        if (this.textarea_filter_blog_entry().val() != this.storage.ng_blog_entry_text) {
            this.button_save_enable();
        }
    }
    textarea_filter_ex_blog_url_keyup() {
        if (this.textarea_filter_ex_blog_url().val()
            != this.ex_blog_buffer[this.ex_blog_last].black_titles) {
            this.button_save_enable();
        }
    }
    textbox_blog_name_keyup() {
        if (this.textbox_blog_name().val()
            != this.ex_blog_buffer[this.ex_blog_last].commment) {
            this.button_save_enable();
        }
    }

    /*!
     *  @brief  前回「非表示チャンネル詳細設定」の後始末
     */
    cleanup_ex_blog_url() {
        if (this.ex_blog_last != '') {
            this.ex_blog_buffer_to_reflect_current(this.ex_blog_last);
            var key = this.selectbox_filter_key()
                    + " option[value=" + this.selectbox_value_ex_blog_url() + "]";
            $(key).remove();
        }
    }
    //
    textarea_filter_blog_url_dblclick() {
        var t = this.textarea_filter_blog_url();
        const blog_url
            = text_utility.search_text_connected_by_new_line(
                t[0].selectionStart,
                t.val());
        if (blog_url == null) {
            return;
        }
        this.cleanup_ex_blog_url();
        this.ex_blog_last = blog_url;
        // selectboxに「$(blog_url)の非表示タイトル」を追加
        {
            const val = this.selectbox_value_ex_blog_url();
            const max_disp_url = 32;
            const text = blog_url.slice(0, max_disp_url) + 'の非表示エントリ';
            this.selectbox_filter().append($("<option>").val(val).text(text));
        }
        // ex_blog_url用textareaの準備
        {
            if (blog_url in this.ex_blog_buffer) {
                const obj = this.ex_blog_buffer[blog_url];
                this.textarea_filter_ex_blog_url().val(obj.black_titles);
                this.textbox_blog_name().val(obj.comment);
            } else {
                this.textarea_filter_ex_blog_url().val('');
                this.textbox_blog_name().val('');
                this.ex_blog_buffer[blog_url]
                    = new BlogFilterParam('', '');
            }
        }
        this.selectbox_filter().val(this.selectbox_value_ex_blog_url());
        this.selectbox_filter_change();
    }

    selectbox_filter_key() {
        return "select[name=select_filter]";
    }
    selectbox_filter() {
        return $(this.selectbox_filter_key());
    }

    selectbox_value_ex_blog_url() {
        return "ng_ex_blog_url";
    }

    is_selected_ng_blog_url() {
        return this.selectbox_filter().val() == "ng_blog_url";
    }
    is_selected_ng_blog_entry() {
        return this.selectbox_filter().val() == "ng_blog_entry";
    }
    is_selected_ng_ex_blog_url() {
        return this.selectbox_filter().val() ==  this.selectbox_value_ex_blog_url();
    }
    is_selected_export_storage() {
        return this.selectbox_filter().val() == "export";
    }
    is_selected_import_storage() {
        return this.selectbox_filter().val() == "import";
    }

    selectbox_filter_change() {
        this.hide_textarea_all();
        this.button_import().hide();
        this.button_save().show();
        if (this.is_selected_ng_blog_url()) {
            this.textarea_filter_blog_url().show();
        } else if (this.is_selected_ng_blog_entry()) {
            this.textarea_filter_blog_entry().show();
        } else if (this.is_selected_ng_ex_blog_url()) {
            this.show_ex_blog_url();
        } else if (this.is_selected_export_storage()) {
            this.show_export_storage();
        } else if (this.is_selected_import_storage()) {
            this.show_import_storage();
        }
    }

    button_save_click() {
        this.storage.clear();
        if (this.ex_blog_last != '') {
            this.ex_blog_buffer_to_reflect_current(this.ex_blog_last);
        }
        //
        {
            var filter
                = text_utility.split_by_new_line(this.textarea_filter_blog_url().val());
            for (const blog_url of filter) {
                if (blog_url != "") {
                    var ng_blog = {};
                    ng_blog.url = blog_url;
                    if (blog_url in this.ex_blog_buffer) {
                        const obj = this.ex_blog_buffer[blog_url];
                        ng_blog.black_titles =
                            text_utility.split_by_new_line(obj.black_titles);
                        ng_blog.comment = obj.comment;
                    } else {
                        ng_blog.black_titles = [];
                        ng_blog.comment = '';
                    }
                    //
                    this.storage.json.ng_blog_url.push(ng_blog);
                }
            }
        }
        {
            var filter
                = text_utility.split_by_new_line(
                    this.textarea_filter_blog_entry().val());
            for (const word of filter) {
                if (word != "") {
                    this.storage.json.ng_blog_entry.push(word);
                }
            }
        }
        //
        this.storage.json.active = this.checkbox_sw_filter().prop("checked");
        this.storage.save();
        this.send_message_to_relative_tab(
            {command:MessageUtil.command_update_storage()});
        //
        this.button_save_disable();
        this.badge.update(this.storage);
        this.storage.update_text();
    }

    button_import_click() {
        if (this.storage.import(this.textarea_import_storage().val())) {
            this.storage.save();
            this.storage.update_text();
            this.updateTextarea();
            this.textarea_import_storage().val("[[OK]]");
        } else {
            this.textarea_import_storage().val("[[ERROR]]");
        }
    }

    updateCheckbox() {
        var json = this.storage.json;
        this.checkbox_sw_filter().prop("checked", json.active);
    }

    updateTextarea() {
        this.textarea_filter_blog_url().val(this.storage.ng_blog_url_text);
        this.textarea_filter_blog_entry().val(this.storage.ng_blog_entry_text);
        {
            const nlc = text_utility.new_line_code_lf();
            {
                this.ex_blog_buffer = [];
                for (const ng of this.storage.json.ng_blog_url) {
                    var bt_text = "";
                    for (const bt of ng.black_titles) {
                        bt_text += bt + nlc;
                    }
                    this.ex_blog_buffer[ng.url]
                        = new BlogFilterParam(bt_text, ng.comment);
                }
            }
            // 最終選択exページに反映しておく(import対応)
            if (this.ex_blog_last in this.ex_blog_buffer) {
                const src = this.ex_blog_buffer[this.ex_blog_last];
                this.textarea_filter_ex_blog_url().val(src.black_titles);
                this.textbox_blog_name().val(src.comment);
            }
        }
    }

    /*!
     *  @brief  現状を「非表示ブログ(URL)詳細加設定」バッファへ反映する
     *  @param  blog_url    対象ブログ(URL)
     */
    ex_blog_buffer_to_reflect_current(blog_url) {
        this.ex_blog_buffer[blog_url]
            = new BlogFilterParam(this.textarea_filter_ex_blog_url().val(),
                                  this.textbox_blog_name().val());
    }


    send_message_to_relative_tab(message) {
        chrome.tabs.query({}, (tabs)=> {
            for (const tab of tabs) {
                const url = new urlWrapper(tab.url);
                if (url.in_livedoor() ||
                    url.in_with2()) {
                    chrome.tabs.sendMessage(tab.id, message);
                }
            }
        });
    }

};

var popup = new Popup();
