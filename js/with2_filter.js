/*!
 *  @brief  with2(ブログランキング)フィルタ
 */
class With2Filter extends FilterBase {

    static ROOT_NODE_TAG = "section#ranking";
    /*!
     *  @brief  新着記事にフィルタをかける
     *  @param  location_node   「新着記事」の場所指定用
     */
    filtering_new_arrival(location_tag) {
        const root_node = $(With2Filter.ROOT_NODE_TAG);
        if (root_node.length <= 0) {
            return;
        }
        const location_node = root_node.find(location_tag);
        if (location_node.length <= 0) {
            return;
        }
        $(location_node).find("ul.jq-follow-list").each((inx, g_item)=> {
            $(g_item).find("li").each((inx, elem)=> {
                const a_tag = $(elem).find("a.jq-follow-link");
                if (a_tag.length <= 0) {
                    return;
                }
                const entry_title = $(a_tag).attr("title");
                const url = 
                    BlogUtil.cut_blog_url_from_with2_link($(a_tag).attr("href"));
                if (this.storage.entry_title_filter(entry_title) ||
                    this.storage.blog_url_filter(url, entry_title)) {
                    $(elem).detach();
                }
            });
        });
    }

    /*!
     *  @brief  ランキングにフィルタをかける
     */
    filtering_ranking() {
        const root_node = $(With2Filter.ROOT_NODE_TAG);
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("ul.rank").each((inx, g_rank)=> {
            $(g_rank).find("li").each((inx, elem)=> {
                if ($(elem).attr("class") != null) {
                    if (elem.className.indexOf("ads") == 0) {
                        $(elem).detach();
                    }
                    return;
                }
                const blog = $(elem).find("a.ttl");
                if (blog.length <= 0) {
                    return;
                }
                const url = 
                    BlogUtil.cut_blog_url_from_with2_link($(blog).attr("href"));
                if (this.storage.blog_url_filter(url)) {
                    $(elem).detach();
                    return;
                }
                $(elem).find("ul.ping").find("li").each((inx, itm)=>{
                    const a_tag = $(itm).find("a");
                    if (a_tag.length <= 0) {
                        return;
                    }
                    const entry_title = $(a_tag).text();
                    if (this.storage.entry_title_filter(entry_title) ||
                        this.storage.blog_url_filter(url, entry_title)) {
                        $(itm).detach();
                    }
                });
            });
        });
    }

    /*!
     *  @brief  フィルタリング
     */
    filtering() {
        this.filtering_ranking();
        this.filtering_new_arrival("article");
        this.filtering_new_arrival("aside");
    }

    get_observing_node(elem) {
        const tag0 = $(With2Filter.ROOT_NODE_TAG);
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
    is_invalid_records(records) {
        // タイムスタンプ以外の追加elementを探す
        const valid = records.find((rec)=> {
            return rec.addedNodes.length > 0 &&
                   rec.target.className != "jq-timeview-wedget";
        });
        return valid == null;
    }

    /*!
     *  @param storage  StorageDataインスタンス
     */
    constructor(storage) {
        super(storage, new ContextMenuController_With2(storage.is_filter_active()));
        super.create_mutation_observer(this.is_invalid_records.bind(this));
    }
}
