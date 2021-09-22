/*!
 *  @brief  with2(ブログランキング)フィルタ
 */
class With2Filter extends FilterBase {

    /*!
     *  @brief  ブログランキングにフィルタをかける
     */
    filtering_ranking() {
        const root_node = $("section#ranking");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("ul.rank").each((inx, g_rank)=> {
            $(g_rank).find("li").each((inx, elem)=> {
                if ($(elem).attr("class") != null) {
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
                $(elem).find("p.ping").find("span.item").each((inx, itm)=>{
                    const entry_title = $($(itm).find("a")[0]).text();
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
    }

    get_observing_node(elem) {
        const tag0 = $("div.ranking");
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
     *  @param storage  StorageDataインスタンス
     */
    constructor(storage) {
        super(storage);
        super.create_after_domloaded_observer(this.is_valid_records.bind(this));
    }
}
