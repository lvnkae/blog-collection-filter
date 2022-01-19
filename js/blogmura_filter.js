/*!
 *  @brief  ブログ村フィルタ
 */
class BlogmuraFilter extends FilterBase {

    /*!
     *  @brief  ブログリストにフィルタをかける
     */
    filtering_blog_list(root_node) {
        $(root_node).find("li.blog-list-item").each((inx, itm)=>{
            const link = $($(itm).find("p.title").find("a")[0]).attr("href");
            const url = BlogUtil.cut_blog_url_from_blogmura_link(link);
            if (this.storage.blog_url_filter(url)) {
                $(itm).detach();
            }
        });
    }
    /*!
     *  @brief  記事リストにフィルタをかける
     */
    filtering_entry_list(root_node) {
        $(root_node).find("li.blog-list-item").each((inx, itm)=>{
            const a_tag = $(itm).find("p.title").find("a")[0];
            const url = BlogUtil.cut_blog_url_from_blogmura_link($(a_tag).attr("href"));
            const entry_title = $(a_tag).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(itm).detach();
            }
        });
    }
    /*!
     *  @brief  記事画像リストにフィルタをかける
     */
    filtering_thumbnail_list(root_node) {
        $(root_node).find("li.thumbnail-list-item").each((inx, itm)=>{
            const link = $($(itm).find("a")[0]).attr("href");
            const url = BlogUtil.cut_blog_url_from_blogmura_link(link);
            const entry_title = $($(itm).find("div.image")[0]).attr("title");
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(itm).detach();
            }
        });
    }    
    /*!
     *  @brief  [side]記事リストにフィルタをかける
     */
    filtering_side_entry_list(root_node) {
        $(root_node).find("li.side-post-list-item").each((inx, itm)=>{
            const a_tag = $(itm).find("a.title");
            const url = BlogUtil.cut_blog_url_from_blogmura_link($(a_tag).attr("href"));
            const entry_title = $(a_tag).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(itm).detach();
            }
        });
    }
    /*!
     *  @brief  トップページにフィルタをかける
     */
    filtering_top() {
        $("div.ranking-wrapper").each((inx, rr)=> {
            this.filtering_blog_list(rr);
        });
        this.filtering_entry_list($("div.feature-post-wrapper"));
        this.filtering_thumbnail_list($("div.post-image-wrapper"));
        this.filtering_entry_list($("div.new-post-wrapper"));
        this.filtering_blog_list($("div.new-site-wrapper"));
        this.filtering_side_entry_list($("div.side-content.feature-post-side-wrapper"));
        this.filtering_side_entry_list($("div.side-content.new-post-side-wrapper"));
        $("div.side-content.ranking-side-wrapper").each((inx, wrapper)=> {
            this.filtering_side_entry_list(wrapper);
        });
        this.filtering_side_entry_list($("div.side-content.past-post-side-wrapper"));
    }

    /*!
     *  @brief  ブログランキングにフィルタをかける
     */
    filtering_ranking() {
        const root_node = $("div.ranking");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("li.blog-list-item").each((inx, itm)=> {
            const blog = $(itm).find("div.blog-detail");
            if (blog.length <= 0) {
                return;
            }
            const link = $($(blog).find("p.title").find("a")[0]).attr("href");
            const url = BlogUtil.cut_blog_url_from_blogmura_link(link);
            if (this.storage.blog_url_filter(url)) {
                $(itm).detach();
                return;
            }
            $(itm).find("div.user-post").find("li").each((inx, post)=>{
                const entry_title = BlogUtil.get_textnode_text($(post).find("a")[0]);
                if (this.storage.entry_title_filter(entry_title) ||
                    this.storage.blog_url_filter(url, entry_title)) {
                    $(post).detach();
                }
            });
        });
    }

    /*!
     *  @brief  注目記事ランキングにフィルタをかける
     */
    filtering_feature() {
        if ($("body.feature-post-wrapper").length <= 0) {
            return;
        }
        this.filtering_entry_list($("div.content-box"));
    }
    /*!
     *  @brief  注目記事ランキングにフィルタをかける
     */
    filtering_newsite() {
        if ($("body.new-site-wrapper").length <= 0) {
            return;
        }
        this.filtering_blog_list($("div.content-box"));
    }
    /*!
     *  @brief  新着記事ランキングにフィルタをかける
     */
    filtering_newpost() {
        if ($("body.new-post-wrapper").length <= 0) {
            return;
        }
        this.filtering_entry_list($("div.content-box"));
    }
    /*!
     *  @brief  新着記事画像にフィルタをかける
     */
    filtering_postimage() {
        if ($("body.post-image-wrapper").length <= 0) {
            return;
        }
        this.filtering_thumbnail_list($("div.content-box"));
    }

    /*!
     *  @brief  フィルタリング
     */
    filtering() {
        this.filtering_top();
        this.filtering_ranking();
        this.filtering_feature();
        this.filtering_newsite();
        this.filtering_newpost();
        this.filtering_postimage();
    }

    get_observing_node(elem) {
        const tag0 = $("div.content-inner");
        $(tag0).each((inx, e)=>{ elem.push(e); });
    }

    callback_domloaded() {
        super.filtering();
        super.callback_domloaded();
    }

    /*!
     *  @brief  無効な追加elementか？
     *  @retun  true    無効
     */
    is_valid_records(records) {
        return false;
    }

    /*!
     *  @param storage  ストレージインスタンス
     */
    constructor(storage) {
        super(storage);
        super.create_after_domloaded_observer(this.is_valid_records.bind(this));
        this.contextmenu_controller
            = new ContextMenuController_Blogmura(storage.is_filter_active()); 
    }
}
