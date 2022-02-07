/*!
 *  @brief  livedoorブログフィルタ
 */
class LivedoorFilter extends FilterBase {

    /*!
     *  @brief  ブログ広告にフィルタをかける
     *  @note   特定のブログを推すバナー広告
     *  @note   ランキングページ用
     */
    filtering_blog_ad(root_node) {
        const aside = $(root_node).find("aside#side");
        if (aside.length <= 0) {
            return;
        }
        $(aside).find("div.ad").each((inx, ad)=> {
            const a_tag = $(ad).find("a");
            if (a_tag.length > 0) {
                const url = $(a_tag[0]).attr("href");
                if (this.storage.blog_url_filter(url)) {
                    $(ad).detach();
                }
            }
        });
    }
    /*!
     *  @brief  ブログ広告にフィルタをかける
     *  @note   特定のブログを推すバナー広告
     *  @note   ブログ速報ページ用
     */
    filtering_blog_ad2(root_node) {
        const aside = $(root_node).find("aside#side");
        if (aside.length <= 0) {
            return;
        }
        $(aside).find("div.banner").each((inx, ban)=> {
            $(ban).find("li").each((inx, ad)=> {
                const a_tag = $(ad).find("a");
                if (a_tag.length > 0) {
                    const url = $(a_tag[0]).attr("href");
                    if (this.storage.blog_url_filter(url)) {
                        $(ad).detach();
                    }
                }
            });
        });
    }

    /*!
     *  @brief  記事リストにフィルタをかける
     *  @param  root_node
     *  @param  title_tag   記事名タグ
     *  @note   記事ランキング・ブログ速報
     */
    filtering_entry_list(root_node, title_tag) {
        const lst = $(root_node).find("div.list");
        if (lst.length <= 0) {
            return;
        }
        $(lst).find("li").each((inx, elem)=> {
            const url = $($(elem).find("a")[0]).attr("href");
            const entry_title = $($(elem).find(title_tag)[0]).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(elem).detach();
            }
        });
    }

    /*!
     *  @brief  おすすめ速報フィルタ
     *  @note   ジャンルごとの更新情報
     */
    filtering_genre() {
        const root_node = $("div.MdList06");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("li").each((inx, elem)=> {
            const ttl = $(elem).find("h3.mdList06Ttl");
            if (ttl.length <= 0) {
                return;
            }
            const a_tag = $(ttl).find("a")[0];
            const url = $(a_tag).attr("href");
            const entry_title = $(a_tag).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(elem).detach();
            }
        });
    }

    /*!
     *  @brief  編集部の推し(よりぬき)フィルタ
     *  @note   ランキングページ等のサイドに出る奴
     */
    filtering_news_selection(root_node) {
        const news = $(root_node).find("div.news.clearfix");
        if (news.length <= 0) {
            return;
        }
        $(news).find("li").each((inx, elem)=> {
            const url = $($(elem).find("a")[0]).attr("href");
            const entry_title = $($(elem).find("span.text")[0]).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(elem).detach();
            }
        });
    }
    /*!
     *  @brief  「編集部の推し」にフィルタをかける
     */
    filtering_news() {
        $("div.news-inner").each((inx, news)=>{
            $(news).find("li").each((inx, elem)=>{
                // リンクが「/jumpnews/nnnnnn」に置き換えられていてURLフィルタが
                // がかけられない。転送先URLを得る仕組みを作れば対応可能だが
                //  1.必要度低そう(「推し」なんて存在自体知らなかった)
                //  2.PFチェックでケチが付きそう(webRequestを使うので)
                // ので保留。記事名フィルタだけにしておく。
                const entry_title = $($(elem).find("span.title")[0]).text();
                if (this.storage.entry_title_filter(entry_title)) {
                    $(elem).detach();
                }
            });
        });
    }

    /*!
     *  @brief  ブログ速報(よりぬき)フィルタ
     *  @note   ランキングページ等のサイドに出る奴
     */
    filtering_headline_selection(root_node) {
        const headline = $(root_node).find("div.headline.clearfix");
        if (headline.length <= 0) {
            return;
        }
        $(headline).find("li").each((inx, elem)=> {
            const url = $($(elem).find("a")[0]).attr("href");
            const entry_title = $($(elem).find("span.comment")[0]).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(elem).detach();
            }
        });
    }
    /*!
     *  @brief  「ブログ速報」にフィルタをかける
     */
    filtering_headline() {
        const root_node = $("div.headline-inner.clearfix");
        if (root_node.length <= 0) {
            return;
        }
        this.filtering_entry_list(root_node, "span.comment");
        this.filtering_ranking_selection(root_node);
        this.filtering_blog_ad2(root_node);
    }

    /*!
     *  @brief  「おすすめブログ」にフィルタをかける
     */
    filtering_select() {
        const root_node = $("div.MdList01");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("li").each((inx, elem)=> {
            const ttl = $(elem).find("h3.mdItem01Ttl");
            if (ttl.length <= 0) {
                return;
            }
            const a_tag = $(ttl).find("a")[0];
            const url = $(a_tag).attr("href");
            if (this.storage.blog_url_filter(url)) {
                $(elem).detach();
                return; // 打ち切ってヨシ
            }
            const e_entry = $(elem).find("div.mdItem01Entry");
            if (e_entry.length <= 0) {
                return;
            }
            const entry_ttl = $(e_entry).find("p.mdItem01EntryTtl");
            if (entry_ttl.length <= 0) {
                return;
            }
            const entry_title = $($(entry_ttl).find("a")[0]).text();
            if (this.storage.entry_title_filter(entry_title)) {
                $(e_entry).detach();
            }
        });
    }
    
    /*!
     *  @brief  ブログランキング(よりぬき)フィルタ
     *  @note   ブログ速報等のサイドに出る奴
     */
    filtering_ranking_selection(root_node) {
        const aside = $(root_node).find("aside#side");
        if (aside.length <= 0) {
            return;
        }
        this.filtering_entry_list(aside, "bold");
    }
    /*!
     *  @brief  ブログランキング(box-全サムネ型)記事フィルタ
     *  @param  base_node   基準ノード
     *  @param  url         対象ブログURL
     *  @note   抽出記事全てのサムネを表示するタイプ
     *  @note   (総合ランキング)
     */
    filtering_ranking_box_allthumbnail_entry(base_node, url) {
        $(base_node).find("img").each((inx, img)=> {
            const entry_title = $(img).attr("alt");
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                const pr = BlogUtil.search_upper_node($(img), (e)=> {
                    return e.localName == 'a';
                });
                if (pr.length > 0) {
                    $(pr).detach();
                }
            }
        });
    }
    /*!
     *  @brief  ブログランキング(box-サムネ選択型)記事フィルタ
     *  @param  base_node   基準ノード
     *  @param  url         対象ブログURL
     *  @note   記事オンマウスでサムネが変わるタイプ
     *  @note   (ブロガー/急上昇ランキング)
     */
    filtering_ranking_box_singlethumbnail_entry(base_node, url) {
        const left = $(base_node).find("div.left");
        const right = $(base_node).find("div.right");
        if (left.length <= 0 || right.length <= 0) {
            return;
        }
        var det = false;
        $(right).find("span.more").each((inx, more)=> {
            const entry_title = $(more).text();
            if (this.storage.entry_title_filter(entry_title) ||
                this.storage.blog_url_filter(url, entry_title)) {
                $(more).detach();
                det = true;
            }
        });
        if (!det) {
            return; // ノード削除なし
        }
        // 後処理：オンマウス記事が消えた場合の対処
        const post_more = $(right).find("span.more");
        if (post_more.length <= 0) {
            // 記事が残ってないのでサムネノード削除
            $($(left).find("img")[0]).detach();
        } else {
            // サムネ切り替え
            $(right).find("span.more").each((inx, more)=> {
                const entry_title = $(more).text();
                const entry_thumbnail =
                    text_utility.remove_new_line_and_space($(more).attr("data-src"));
                var thumbnail = $(left).find("img")[0];
                $(thumbnail).attr("alt", entry_title);
                $(thumbnail).attr("src", entry_thumbnail);
                return false;
            });
        }            
    }
    /*!
     *  @brief  ブログランキング(box型)にフィルタをかける
     */
    filtering_ranking_box(root_node) {
        const box = $(root_node).find("div.box");
        if (box.length <= 0) {
            return;
        }
        $(box).find("li").each((inx, elem)=> {
            const title = $(elem).find("div.title");
            if (title.length <= 0) {
                return;
            }
            const a_tag = $(title).find("a");
            if (a_tag.length <= 0) {
                return;
            }
            const url = $(a_tag[0]).attr("href");
            if (this.storage.blog_url_filter(url)) {
                $(elem).detach();
                return;
            }
            const inner = $(elem).find("div.box-inner.clearfix");
            if (inner.length <= 0) {
                return;
            }
            if ($(inner).find("div.right-inner").length > 0) {
                this.filtering_ranking_box_allthumbnail_entry(inner, url);
            } else {
                this.filtering_ranking_box_singlethumbnail_entry(inner, url);
            }
        });
    }
    /*!
     *  @brief  「ランキング」にフィルタをかける
     */
    filtering_ranking() {
        const root_node = $("div.ranking-inner.clearfix");
        if (root_node.length <= 0) {
            return;
        }
        this.filtering_ranking_box(root_node);
        this.filtering_entry_list(root_node, "span.bold");
        this.filtering_headline_selection(root_node);
        this.filtering_news_selection(root_node);
        this.filtering_blog_ad(root_node);
    }
    
    /*!
     *  @brief  カテゴリ->カテゴリ内ランキングにフィルタをかける
     */
    filtering_category_ranking() {
        const root_node = $("div.category-ranking-inner.clearfix");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("li").each((inx, elem)=> {
            const blog = $(elem).find("span.bold");
            if (blog.length <= 0) {
                return;
            }
            const a_tag = $(blog).find("a")[0];
            const url = $(a_tag).attr("href");
            if (this.storage.blog_url_filter(url)) {
                $(elem).detach();
                return;
            }
            $(elem).find("span.more").each((inx, entry)=> {
                const entry_title = $($(entry).find("a")[0]).text();
                if (this.storage.entry_title_filter(entry_title) ||
                    this.storage.blog_url_filter(url, entry_title)) {
                    $(entry).detach();
                }
            });
        });
    }
    /*!
     *  @brief  カテゴリ→新着エントリーにフィルタをかける
     */
    filtering_category_recent() {
        const root_node = $("div.category-recent-inner.clearfix");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("li").each((inx, elem)=> {
            const blog = $(elem).find("span.name");
            const entry = $(elem).find("span.bold");
            if (blog.length <= 0 || entry.length <= 0) {
                return;
            }
            const entry_title = $($(entry).find("a")[0]).text();
            const url = $($(blog).find("a")[0]).attr("href");
            if (this.storage.blog_url_filter(url, entry_title) ||
                this.storage.entry_title_filter(entry_title)) {
                $(elem).detach();
            }
        });
    }
    /*!
     *  @brief  カテゴリ(home)にフィルタをかける
     */
    filtering_category_home() {
        const root_node = $("div#lb-category-list");
        if (root_node.length <= 0) {
            return;
        }
        $(root_node).find("div.box").each((inx, box)=>{
            const e_ul = $(box).find("ul.img.clearfix");
            if (e_ul.length <= 0) {
                return;
            }
            $(e_ul).find("li").each((inx, elem)=> {
                const thumb = $(elem).find("img");
                if (thumb.length <= 0 || $(thumb).attr("alt") == null) {
                    return;
                }
                const a_tag = BlogUtil.search_upper_node($(thumb), (e)=> {
                    return e.localName == 'a';
                });
                if (a_tag.length == 0) {
                    return;
                }
                const url = $(a_tag).attr("href");
                if (this.storage.blog_url_filter(url)) {
                    $(elem).detach();
                    return;
                }
            });
        });
    }
    /*!
     *  @brief  「カテゴリ」にフィルタをかける
     */
    filtering_category() {
        this.filtering_category_home();
        this.filtering_category_ranking();
        this.filtering_category_recent();
    }

    /*!
     *  @brief  フィルタリング
     */
    filtering() {
        this.filtering_ranking();
        this.filtering_headline();
        this.filtering_category();
        this.filtering_news();
        this.filtering_select();
        this.filtering_genre();
    }

    get_observing_node(elem) {
        const tag_genre = $("div.LyContents.MdCF");
        $(tag_genre).each((inx, e)=>{
            elem.push(e); 
        });
        const tag_ranking = $("div.contents")
        $(tag_ranking).each((inx, e)=>{
            elem.push(e); 
        });
        const tag_category = $("div#lb-category-list");
        $(tag_category).each((inx, e)=>{
            elem.push(e); 
        });
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
        super.create_mutation_observer(this.is_valid_records.bind(this));
        this.contextmenu_controller
            = new ContextMenuController_Livedoor(storage.is_filter_active());
    }
}
