/*!
 *  @brief  右クリックメニュー制御(ブログ村用)
 */
class ContextMenuController_Blogmura extends ContextMenuController {

    // ブログitemリスト
    static get_blog_item_name(nd_blogmura) {
        if ($(nd_blogmura).find("div.user-box").length <= 0) {
            // USERを持たない要素は対象外(ブログitemではない)
            return null;
        }
        // sub-titleが存在する場合はそちらがブログ名(=記事リスト)
        const e_p_subtitle = $(nd_blogmura).find("p.sub-title");
        if (e_p_subtitle.length > 0) {
            return $(e_p_subtitle).text();
        } 
        const e_span_subtitle = $(nd_blogmura).find("span.sub-title");
        if (e_span_subtitle.length > 0) {
            return $(e_span_subtitle).text();
        } 
        // 存在しなければtitleがそのままブログ名(=ランキング)
        const e_title = $(nd_blogmura).find("p.title");
        if (e_title.length <= 0) {
            return null;
        }
        const a_tag = $(e_title).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return $(a_tag).text();
    }
    static get_blog_item_domain(nd_blogmura) {
        const e_title = $(nd_blogmura).find("p.title") ;
        if (e_title.length <= 0) {
            return null;
        }
        const a_tag = $(e_title).find("a");
        if (a_tag.length <= 0) {
            return null;
        }
        const url = BlogUtil.cut_blog_url_from_blogmura_link($(a_tag).attr("href"));
        return BlogUtil.cut_blog_domain_from_link(url);
    }

    // ブログ記事サムネイル
    static get_thumb_blog_item_domain(nd_blogmura) {
        const e_img = $(nd_blogmura).find("div.image-wrapper");
        if (e_img.length <= 0) {
            return null;
        }
        const a_tag = BlogUtil.search_upper_node($(e_img), (e)=> {
            return e.localName == 'a' &&
                   $(e).attr("target") == '_blank';
        });
        if (a_tag.length <= 0) {
            return null;
        }
        const url = BlogUtil.cut_blog_url_from_blogmura_link($(a_tag).attr("href"));
        return BlogUtil.cut_blog_domain_from_link(url);
    }

    // [side]ブログitemリスト
    static get_side_blog_item_name(nd_blogmura) {
        const e_text = $(nd_blogmura).find("div.post-text");
        if (e_text.length <= 0) {
            return null;
        }
        const a_tag = $(e_text).find("a.user");
        if (a_tag.length <= 0) {
            return null;
        }
        return a_tag[0].innerText;
    }
    static get_side_blog_item_domain(nd_blogmura) {
        const e_text = $(nd_blogmura).find("div.post-text");
        if (e_text.length <= 0) {
            return null;
        }
        const a_tag = $(e_text).find("a.title");
        if (a_tag.length <= 0) {
            return null;
        }
        const url = BlogUtil.cut_blog_url_from_blogmura_link($(a_tag).attr("href"));
        return BlogUtil.cut_blog_domain_from_link(url);
    }

    /*!
     *  @brief  ブログ名を得る
     *  @param  element ランキング要素の起点ノード
     */
    get_blog_name(nd_blogmura) {
        const blog_item
            = ContextMenuController_Blogmura.get_blog_item_name(nd_blogmura);
        if (blog_item != null) {
            return blog_item;
        }
        const side_blog_item
            = ContextMenuController_Blogmura.get_side_blog_item_name(nd_blogmura);
        if (side_blog_item != null) {
            return side_blog_item;
        }
        // サムネイル形式はブログ名もユーザ名も取得できないのでdomainで代用
        return ContextMenuController_Blogmura.get_thumb_blog_item_domain(nd_blogmura);
    }
    /*!
     *  @brief  ブログURLを得る
     *  @param  element ランキング要素の起点ノード
     */
    get_blog_url(nd_blogmura) {
        const blog_item
            = ContextMenuController_Blogmura.get_blog_item_domain(nd_blogmura);
        if (blog_item != null) {
            return blog_item;
        }
        const new_arrival
            = ContextMenuController_Blogmura.get_side_blog_item_domain(nd_blogmura);
        if (new_arrival != null) {
            return new_arrival;
        }
        return ContextMenuController_Blogmura.get_thumb_blog_item_domain(nd_blogmura);
    }
    
    /*!
     *  @brief  ランキング要素の起点ノードを得る
     *  @param  element 右クリックされたelement
     *  @note   ランキング内の1ブログ分の要素(タイル？カード？)の起点
     */
    get_base_node(element) {
        const nd_blog_item = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.classList.length > 0 &&
                   e.classList[0] == 'blog-list-item';
        });
        if (nd_blog_item.length > 0) {
            return nd_blog_item;
        }
        const nd_side_blog_item = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.classList.length > 0 &&
                   e.classList[0] == 'side-post-list-item';
        });
        if (nd_side_blog_item.length > 0) {
            return nd_side_blog_item;
        }
        const nd_thumb_blog_item = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.classList.length > 0 &&
                   e.classList[0] == 'thumbnail-list-item';
        });
        return nd_thumb_blog_item;
    }

    /*!
     */
    constructor(active) {
        super(active);
    }
}
