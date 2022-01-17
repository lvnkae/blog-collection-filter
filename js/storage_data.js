/*!
 *  @brief  データクラス
 */
class StorageData {

    constructor() {
        this.clear();
    }

    filter_key() {
        return "Filter";
    }

    load() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get((items) => {
                if (this.filter_key() in items) {
                    this.json = JSON.parse(items[this.filter_key()]);
                    this.update_text();
                } else {
                    this.clear();
                }
                resolve();
            });
        }); 
    }

    save() {
        var jobj = {};
        jobj[this.filter_key()] = JSON.stringify(this.json);
        chrome.storage.local.set(jobj);
    }
    
    clear() {
        this.json = {}
        this.json.active = true;        // フィルタ 有効/無効
        this.json.reduce_ad = false;    // 広告を控えめにする 有効/無効
        this.json.ng_blog_url = [];     // ブログフィルタ(URL)
        this.json.ng_blog_entry = [];   // ブログ記事フィルタ(ワード)

        this.clear_text_buffer();
    }

    clear_text_buffer() {
        this.ng_blog_url_text = "";
        this.ng_blog_entry_text = "";
    }

    update_text() {
        this.clear_text_buffer();
        //  フィルタを改行コードで連結してバッファに格納
        const NLC = text_utility.new_line_code_lf();
        for (const ng of this.json.ng_blog_url) {
            this.ng_blog_url_text += ng.url + NLC;
        }
        for (const word of this.json.ng_blog_entry) {
            this.ng_blog_entry_text += word+ NLC;
        }
    }

    /*!
     *
     */
    is_filter_active() { return this.json.active; }

    /*!
     *  @brief  ブログURLフィルタ設定を追加(重複チェックあり)
     *  @param  url     設定するURL
     *  @param  bname   ブログ名
     *  @retval true    storage構成変更があった
     */
    add_blog_url_mute_with_check(url, bname) {
        if (this.json.ng_blog_url == null) {
            this.json.ng_blog_url = [];
        }
        for (const obj of this.json.ng_blog_url) {
            if (obj.url == url) {
                return false;
            }
        }
        var ng_blog = {};
        ng_blog.url = url;
        ng_blog.black_titles = [];
        ng_blog.comment = bname;
        this.json.ng_blog_url.push(ng_blog);
        return true;
    }

    /*!
     *  @brief  ワードフィルタ
     *  @param  word            調べる文字列
     *  @param  filtering_words フィルタ
     */
    static word_filter(word, filtering_words) {
        if (word != null) {
            for (const w of filtering_words) {
                if (text_utility.regexp_indexOf(w, word)) {
                    return true;
                }
            }
        }
        return false;
    }

    /*!
     *  @brief  エントリタイトルフィルタ
     *  @param  title   記事タイトル
     *  @retval true    除外対象だ
     */
    entry_title_filter(title) {
        return StorageData.word_filter(title, this.json.ng_blog_entry);
    }

    /*!
     *  @brief  URL固有エントリタイトルフィルタ
     *  @param  url     ブログURL
     *  @param  title   記事タイトル
     *  @retval true    除外対象だ
     */
    blog_url_filter(url, title) {
        for (const ng of this.json.ng_blog_url) {
            if (url.indexOf(ng.url) >= 0) {
                if (ng.black_titles.length == 0 ||
                    StorageData.word_filter(title, ng.black_titles)) {
                    return true;
                }
            }
        }
        return false;
    }
}
