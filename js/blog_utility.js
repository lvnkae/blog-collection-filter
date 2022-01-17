/*!
 *  @brief  Blog関連Utility
 */
class BlogUtil {

    /*!
     *  @brief  with2のオプション付きリンクからURLを切り出す
     */
    static cut_blog_url_from_with2_link(link) {
        const link_div = link.split('=');
        const len = link_div.length;
        if (len <= 0) {
            return "";
        } else {
            return decodeURIComponent(link_div[len-1]);
        }
    }
    /*!
     *  @brief  ブログ村のオプション付きリンクからURLを切り出す
     *  @note   現状with2と同じ処理だが一応分けとく
     */
    static cut_blog_url_from_blogmura_link(link) {
        const link_div = link.split('=');
        const len = link_div.length;
        if (len <= 0) {
            return "";
        } else {
            return decodeURIComponent(link_div[len-1]);
        }
    }

    /*!
     *  @brief  ライブドアブログのリンクからドメインを切り出す
    *   @note   独自ドメインでない場合はsubdirも参照
    */
    static cut_blog_domain_from_livedoor_link(link) {
        var url_w = new urlWrapper(link);
        if (url_w.domain == 'blog.livedoor.jp') {
            return url_w.domain + '/' + url_w.subdir[0];
        } else {
            // 独自ドメイン
            return url_w.domain;
        }
    }

    /*!
     *  @brief  ページチャンネルURLを得る
     */
    static get_page_author_url() {
        return location.href;
    }

    /*!
     *  @brief  要素が非表示であるか
     *  @param  e   調べる要素
     */
    static in_disappearing(e) {
        if ($(e).attr("hidden") != null) {
            return true;
        }
        const attr_style = $(e).attr("style");
        if (attr_style != null && attr_style.indexOf("display: none;") >= 0) {
            return true;
        }
        return false;
    }
    /*!
     *  @brief  key要素を探す
     *  @param  start_elem  探索起点
     *  @param  key         探索キー
     *  @note   first-hit
     *  @note   非表示(hidden, display none)は除外する
     */
    static find_first_appearing_element(start_elem, key) {
        const elements = $(start_elem).find(key)
        for (var e of elements) {
            if (!this.in_disappearing(e)) {
                return e;
            }
        }
        return null
    }

    /*!
     *  @brief  木構造の上位方向へ検索する
     *  @param  elem    基準ノード
     *  @param  func    判定関数
     *  @note   findの逆
     */
    static search_upper_node(elem, func) {
        while(elem.length > 0) {
            if (func(elem[0])) {
                return elem;
            }
            elem = elem.parent();
        }
        return {length:0};
    }

    /*!
     *  @brief  木構造の上位方向へ検索してdetach
     *  @param  elem    基準ノード
     *  @param  tag     検索タグ
     */
    static detach_upper_node(elem, tag) {
        const check_tag = function(e) {
            return e.localName == tag;
        }
        const nd = YoutubeUtil.search_upper_node(elem, check_tag);
        if (nd.length == 0) {
            return;
        }
        $(nd).detach();
    }

    /*!
     *  @brief  木構造の下位方向へ検索してdetach
     *  @param  elem    基準ノード
     *  @param  tag     検索タグ
     */
    static detach_lower_node(elem, tag) {
        const dt_node = $(elem).find(tag);
        if (dt_node.length == 0) {
            return;
        }
        $(dt_node).detach();
    }

    /*!
     *  @brief  textノードのテキストだけを得る
     *  @note   aタグがspan等特殊ノードを内包してる場合に使う
     */
    static get_textnode_text(p) {
        var text = "";
        for (const cn of p.childNodes) {
            if (cn.nodeName == "#text") {
                text += cn.textContent;
            }
        }
        return text;
    }
}
