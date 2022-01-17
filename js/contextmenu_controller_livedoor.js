/*!
 *  @brief  右クリックメニュー制御(livedoorブログ用)
 */
class ContextMenuController_Livedoor extends ContextMenuController {

    // ランキング->総合、ブロガー、急上昇
    static get_ranking_blog_name(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.title");
        if (e_div.length == 0) {
            return null;
        }
        const e_h3 = $(e_div).find("h3");
        if (e_h3.length == 0) {
            return null;
        }
        return $(e_h3[0]).text();
    }
    static get_ranking_blog_domain(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.title");
        if (e_div.length == 0) {
            return null;
        }
        const e_h3 = $(e_div).find("h3");
        if (e_h3.length == 0) {
            return null;
        }
        const a_tag = $(e_h3).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }
    // ランキング->記事
    static get_ranking_entry_blog_name(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.box");
        if (e_div.length == 0) {
            return null;
        }
        const e_span = $(e_div).find("span.name");
        if (e_span.length == 0) {
            return null;
        }
        return $(e_span[0]).text();
    }
    static get_ranking_entry_blog_domain(nd_livedoor) {
        const e_span = $(nd_livedoor).find("span.number");
        if (e_span.length == 0 || e_span[0].classList[1].indexOf("rank") != 0) {
            return null;
        }
        const a_tag = BlogUtil.search_upper_node($(e_span), (e)=> {
            return e.localName == 'a';
        });
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }

    // カテゴリ->home
    static get_category_home_blog_name(nd_livedoor) {
        const e_photo = $(nd_livedoor).find("div.photo");
        const e_text = $(nd_livedoor).find("span.text");
        if (e_photo.length == 0 || e_text.length == 0) {
            return null;
        }
        const e_img = $(e_photo).find("img");
        if (e_img.lenght == 0) {
            return null;
        }
        return $(e_img).attr("alt");
    }
    static get_category_home_blog_domain(nd_livedoor) {
        const e_photo = $(nd_livedoor).find("div.photo");
        const e_text = $(nd_livedoor).find("span.text");
        if (e_photo.length == 0 || e_text.length == 0) {
            return null;
        }
        const e_img = $(e_photo).find("img");
        if (e_img.lenght == 0 || $(e_img).attr("alt") == null) {
            return null;
        }
        const a_tag = BlogUtil.search_upper_node($(e_photo), (e)=> {
            return e.localName == 'a';
        });
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }
    // カテゴリ->新着エントリー
    static get_category_blog_name(nd_livedoor) {
        const e_span = $(nd_livedoor).find("span.name");
        if (e_span.length == 0) {
            return null;
        }
        return $(e_span[0]).text();
    }
    static get_category_blog_domain(nd_livedoor) {
        const e_span = $(nd_livedoor).find("span.name");
        if (e_span.length == 0) {
            return null;
        }
        const a_tag = $(e_span).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }
    // カテゴリ->カテゴリ内ランキング
    static get_category_rank_blog_name(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.box");
        if (e_div.length == 0) {
            return null;
        }
        const e_span = $(e_div).find("span.bold");
        if (e_span.length == 0) {
            return null;
        }
        return $(e_span[0]).text();
    }
    static get_category_rank_blog_domain(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.box");
        if (e_div.length == 0) {
            return null;
        }
        const e_span = $(e_div).find("span.bold");
        if (e_span.length == 0) {
            return null;
        }
        const a_tag = $(e_span).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }

    // ブログ速報
    static get_headline_blog_name(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.right");
        if (e_div.length == 0) {
            return null;
        }
        const e_span = $(e_div).find("span.title");
        if (e_span.length == 0) {
            return null;
        }
        return $(e_span[0]).text();
    }
    static get_headline_blog_domain(nd_livedoor) {
        const e_div = $(nd_livedoor).find("div.right");
        if (e_div.length == 0) {
            return null;
        }
        const e_span = $(e_div).find("span.title");
        if (e_span.length == 0) {
            return null;
        }
        const a_tag = BlogUtil.search_upper_node($(e_span), (e)=> {
            return e.localName == 'a';
        });
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }

    // おすすめブログ
    static get_select_blog_name(nd_livedoor) {
        const e_h3 = $(nd_livedoor).find("h3.mdItem01Ttl");
        if (e_h3.length == 0) {
            return null;
        }
        return $(e_h3[0]).text();
    }
    static get_select_blog_domain(nd_livedoor) {
        const e_h3 = $(nd_livedoor).find("h3.mdItem01Ttl");
        if (e_h3.length == 0) {
            return null;
        }
        const a_tag = $(e_h3).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }

    // おすすめ速報
    static get_genre_blog_domail(nd_livedoor) {
        const e_thmb = $(nd_livedoor).find("div.mdList06Thumb");
        if (e_thmb.length == 0) {
            return null;
        }
        const a_tag = $(e_thmb).find("a");
        if (a_tag.length == 0) {
            return null;
        }
        return BlogUtil.cut_blog_domain_from_livedoor_link($(a_tag[0]).attr("href"));
    }


    /*!
     *  @brief  ブログ名を得る
     *  @param  nd_livedoor 右クリックされたelementの起点ノード
     */
    get_blog_name(nd_livedoor) {
        const ranking 
            = ContextMenuController_Livedoor.get_ranking_blog_name(nd_livedoor);
        if (ranking != null) {
            return ranking;
        }
        const ranking_entry
            = ContextMenuController_Livedoor.get_ranking_entry_blog_name(nd_livedoor);
        if (ranking_entry != null) {
            return ranking_entry;
        }
        const category_home
            = ContextMenuController_Livedoor.get_category_home_blog_name(nd_livedoor);
        if (category_home != null) {
            return category_home;
        }
        const category_rank
            = ContextMenuController_Livedoor.get_category_rank_blog_name(nd_livedoor);
        if (category_rank != null) {
            return category_rank;
        }
        const category
            = ContextMenuController_Livedoor.get_category_blog_name(nd_livedoor);
        if (category != null) {
            return category;
        }
        const headline
            = ContextMenuController_Livedoor.get_headline_blog_name(nd_livedoor);
        if (headline != null) {
            return headline;
        }
        const select_blog
            = ContextMenuController_Livedoor.get_select_blog_name(nd_livedoor);
        if (select_blog != null) {
            return select_blog;
        }
        // "おすすめ速報"ではブログ名が取得できないのでdomainで代用
        const genre = ContextMenuController_Livedoor.get_genre_blog_domail(nd_livedoor);
        if (genre != null) {
            return genre;
        }
        return null;
    }
    /*!
     *  @brief  ブログURLを得る
     *  @param  nd_livedoor 右クリックされたelementの起点ノード
     */
    get_blog_url(nd_livedoor) {
        const ranking 
            = ContextMenuController_Livedoor.get_ranking_blog_domain(nd_livedoor);
        if (ranking != null) {
            return ranking;
        }
        const ranking_entry
            = ContextMenuController_Livedoor.get_ranking_entry_blog_domain(nd_livedoor);
        if (ranking_entry != null) {
            return ranking_entry;
        }
        const category_home
            = ContextMenuController_Livedoor.get_category_home_blog_domain(nd_livedoor);
        if (category_home != null) {
            return category_home;
        }
        const category_rank
            = ContextMenuController_Livedoor.get_category_rank_blog_domain(nd_livedoor);
        if (category_rank != null) {
            return category_rank;
        }
        const category
            = ContextMenuController_Livedoor.get_category_blog_domain(nd_livedoor);
        if (category != null) {
            return category;
        }
        const headline
            = ContextMenuController_Livedoor.get_headline_blog_domain(nd_livedoor);
        if (headline != null) {
            return headline;
        }
        const select_blog
            = ContextMenuController_Livedoor.get_select_blog_domain(nd_livedoor);
        if (select_blog != null) {
            return select_blog;
        }
        const genre = ContextMenuController_Livedoor.get_genre_blog_domail(nd_livedoor);
        if (genre != null) {
            return genre;
        }
        return null;
    }
    
    /*!
     *  @brief  起点ノードを得る
     *  @param  element 右クリックされたelement
     */
    get_base_node(element) {
        // カテゴリ->カテゴリ内ランキング
        const nd_category_rank = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.className.indexOf('rank') == 0;
        });
        if (nd_category_rank.length > 0) {
            return nd_category_rank;
        }
        // おすすめ速報
        const nd_genre = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.attributes.length > 0 &&
                   e.attributes[0].localName == 'style';
        });
        if (nd_genre.length > 0) {
            return nd_genre;
        }
        // ブログランキング
        // ブログ速報
        // おすすめブログ
        // カテゴリ->home、新着エントリー
        const nd_category = BlogUtil.search_upper_node($(element), (e)=> {
            return e.localName == 'li' &&
                   e.className == "" &&
                   e.attributes.length == 0;
        });
        return nd_category;
    }

    /*!
     *  @brief  event:右クリック
     *  @param  loc     現在location(urlWrapper)
     *  @param  element 右クリックされたelement
     */
    event_mouse_right_click(loc, element) {
        if (!loc.in_livedoor()) {
            return;
        }
        if (this.filter_active) {
            const nd_livedoor = this.get_base_node(element);
            if (nd_livedoor.length > 0 && super.on_mute_menu(nd_livedoor)) {
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
