/*!
 *  @brief  データクラス
 */
class StorageData {

    static CSV_TAG_URL = "NG_BLOG_URL=";
    static CSV_TAG_COMMENT = "NB_BLOG_COMMENT=";
    static CSV_TAG_BL = "NG_BLOG_NG_WORD=";
    static CSV_TAG_WORD = "NG_WORD=";

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
     *  @brief  export用に文字列をencodeする
     *  @note   一部記号をエスケープするだけ
     */
    static encord_for_export(txt) {
        var enc = "";
        [...txt].forEach(c => {
            if (c == "\\") {
                enc += "\\";
            } else if (c== '"') {
                // excelのエスケープにあわせておく
                enc += '"';
            }
            enc += c;
        });
        return enc;
    }
    /*!
     *  @brief  URLフィルタ1設定分をcsv形式で出力
     */
    static export_ng_url_unit(ng) {
        var retcsv = "";
        if (ng.url == "") {
            return "";
        }
        retcsv += StorageData.CSV_TAG_URL + ","
               + '"' + StorageData.encord_for_export(ng.url) + '"';
        retcsv += "," + StorageData.CSV_TAG_COMMENT + ","
               + '"' + StorageData.encord_for_export(ng.comment) + '"';
        retcsv += "," + StorageData.CSV_TAG_BL;
        for (const ngt of ng.black_titles) {
            if (ngt != "") {
                retcsv += "," + '"' + StorageData.encord_for_export(ngt) + '"';
            }
        }
        return retcsv;
    }
    /*!
     *  @brief  WORDフィルタ1設定分をcsv形式で出力
     */
    static export_ng_word_unit(word) {
        var retcsv = "";
        if (word == "") {
            return "";
        }
        retcsv += StorageData.CSV_TAG_WORD + ","
               + '"' + StorageData.encord_for_export(word) + '"';
        return retcsv;
    }
    /*!
     *  @brief  保存内容をcsv形式で出力する
     */
    export() {
        var retcsv = "";
        const NLC = text_utility.new_line_code_lf();
        for (const ng of this.json.ng_blog_url) {
            retcsv += StorageData.export_ng_url_unit(ng) + NLC;
        }
        for (const word of this.json.ng_blog_entry) {
            retcsv += StorageData.export_ng_word_unit(word) + NLC;
        }
        return retcsv;
    }

    /*!
     *  @brief  1行分のimportデータ(csv)を要素ごとに分割
     */
    static split_import_csv_row(row) {
        var split_row = [];
        var in_db_quote = false;
        var db_quote_push = false;
        var in_escape = false;
        var buffer = "";
        [...row].forEach(c=>{
            if (db_quote_push) {
                // prevがdb_quoteだった場合の例外処理
                db_quote_push = false;
                if (c == '"') {
                    // エスケープされてるので1つだけ採用
                    buffer += c;
                    return; // 打ち切り
                } else {
                    // db_quote括り閉じ
                    if (in_db_quote) {
                        in_db_quote = false;
                    }
                }
            }
            if (c == "\\") {
                if (in_escape) {
                    buffer += c;
                    in_escape = false;
                } else {
                    // エスケープ
                    in_escape = true;
                }
            } else if (c == '"') {
                if (in_db_quote) {
                    // 棚上げ
                    db_quote_push = true;
                } else {
                    // db_quote括り開始
                    in_db_quote = true;
                }
            } else if (c == ",") {
                if (in_db_quote) {
                    buffer += c;
                } else {
                    split_row.push(buffer);
                    buffer = "";
                }
            } else {
                buffer += c;
            }
        });
        if (buffer != "") {
            split_row.push(buffer);
        }
        return split_row;
    }
    /*!
     *  @brief  1行分のimportデータをstorageへ書き込む
     */
    import_row(split_row) {
        if (split_row.length <= 0) {
            return true;
        }
        const SPR_INDEX_TYPE_TAG = 0;
        if (split_row[SPR_INDEX_TYPE_TAG] == StorageData.CSV_TAG_URL) {
            const MAX_LEN_IMPORT_URL = 72;
            const SPR_INDEX_URL = 1;
            const SPR_INDEX_COMMENT_TAG = 2;
            const SPR_INDEX_COMMENT = 3;
            const SPR_INDEX_BL_TAG = 4;
            const SPR_INDEX_BL_TOP = 5;
            const src_url = split_row[SPR_INDEX_URL];
            if (src_url.length > MAX_LEN_IMPORT_URL) {
                return false;
            }
            for (var obj of this.json.ng_blog_url) {
                if (obj.url == split_row[SPR_INDEX_URL]) {
                    if (split_row[SPR_INDEX_COMMENT_TAG] == StorageData.CSV_TAG_COMMENT) {
                        obj.comment = split_row[SPR_INDEX_COMMENT];
                    }
                    if (split_row[SPR_INDEX_BL_TAG] == StorageData.CSV_TAG_BL) {
                        obj.black_titles = [];
                        for (var inx = SPR_INDEX_BL_TOP; inx < split_row.length; inx++) {
                            if (split_row[inx] != "") {
                                obj.black_titles.push(split_row[inx]);
                            }
                        }
                    }
                    return true;
                }
            }
            var ng_blog = {};
            ng_blog.url = split_row[SPR_INDEX_URL];
            if (split_row[SPR_INDEX_COMMENT_TAG] == StorageData.CSV_TAG_COMMENT) {
                ng_blog.comment = split_row[SPR_INDEX_COMMENT];
            } else {
                return false;
            }
            if (split_row[SPR_INDEX_BL_TAG] == StorageData.CSV_TAG_BL) {
                ng_blog.black_titles = [];
                for (var inx = SPR_INDEX_BL_TOP; inx < split_row.length; inx++) {
                    if (split_row[inx] != "") {
                        ng_blog.black_titles.push(split_row[inx]);
                    }
                }
            } else {
                return false;
            }
            this.json.ng_blog_url.push(ng_blog);            
        } else if (split_row[SPR_INDEX_TYPE_TAG] == StorageData.CSV_TAG_WORD) {
            const SPR_INDEX_WORD = 1;
            for (const word of this.json.ng_blog_entry) {
                if (word == split_row[SPR_INDEX_WORD]) {
                    return true;
                }
            }
            this.json.ng_blog_entry.push(split_row[SPR_INDEX_WORD]);
        }
        return true;
    }

    import(csv) {
        var csv_array = text_utility.split_by_new_line(csv);
        for (const csv_row of csv_array) {
            if (!this.import_row(StorageData.split_import_csv_row(csv_row))) {
                return false;
            }
        }
        return true;
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
