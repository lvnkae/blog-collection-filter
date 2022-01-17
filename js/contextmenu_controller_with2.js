/*!
 *  @brief  右クリックメニュー制御(with2(ブログランキング)用)
 */
class ContextMenuController_With2 extends ContextMenuController {

    static get_ranking_blog_name(nd_with2) {
        const e_body = $(nd_with2).find("div.body");
        if (e_body.length == 0) {
            return null;
        }
        const a_tag = $(e_body).find("a.ttl");
        if (a_tag.length == 0) {
            return null;
        }
        return $(a_tag).text();
    }

    static get_ranking_blog_url(nd_with2) {
        const e_body = $(nd_with2).find("div.body");
        if (e_body.length == 0) {
            return null;
        }
        const a_tag = $(e_body).find("a.ttl");
        if (a_tag.length == 0) {
            return null;
        }
        var url_w = new
            urlWrapper(BlogUtil.cut_blog_url_from_with2_link($(a_tag[0]).attr("href")));
        return url_w.get_url_without_protocol();
    }

    /*!
     *  @brief  ブログ名を得る
     *  @param  element ランキング要素の起点ノード
     */
    get_blog_name(nd_with2) {
        return ContextMenuController_With2.get_ranking_blog_name(nd_with2);
    }
    /*!
     *  @brief  ブログURLを得る
     *  @param  element ランキング要素の起点ノード
     */
    get_blog_url(nd_with2) {
        return ContextMenuController_With2.get_ranking_blog_url(nd_with2);
    }
    
    /*!
     *  @brief  ランキング要素の起点ノードを得る
     *  @param  element 右クリックされたelement
     *  @note   ランキング内の1ブログ分の要素(タイル？カード？)の起点
     */
    get_base_node(element) {
        const nd_ranking_section = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'section' &&
                   e.classList.length > 0 &&
                   e.classList[0] == 'item';
        });
        return nd_ranking_section;
    }

    /*!
     *  @brief  event:右クリック
     *  @param  loc     現在location(urlWrapper)
     *  @param  element 右クリックされたelement
     */
    event_mouse_right_click(loc, element) {
        if (!loc.in_with2()) {
            return;
        }
        if (this.filter_active) {
            const nd_with2 = this.get_base_node(element);
            if (nd_with2.length > 0 && super.on_mute_menu(nd_with2)) {
                return;
            }
        }
        ContextMenuController.off_original_menu();
    }

    /*!
     */
    constructor(active) {
        super();
        this.filter_active = active;
    }
}
