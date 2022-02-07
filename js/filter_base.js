/*!
 *  @brief  フィルタベース
 *  @note   個別フィルタクラスの親
 */
class FilterBase {

    initialize() {
        const active = this.storage.json.active;
        const loc = this.current_location;
        if (loc.in_livedoor()) {
            //this.contextmenu_controller = new ContextMenuController_Livedoor(active);
        }
    }

    /*!
     *  @param storage  ストレージインスタンス(shared_ptr的なイメージ)
     */
    constructor(storage) {
        this.storage = storage;
        //
        this.current_location = new urlWrapper(location.href);
        this.mutation_observer = null;
        this.observer_timer = null;
        this.filtering_timer = null;
        //
        this.initialize();
    }

    /*!
     *  @brief  DOM要素追加callback
     *  @note   DOM要素追加タイミングで行いたい処理群
     */
    callback_domelement_adition() {}
    /*!
     *  @brief  高速化用マーカーをクリアする
     */
    clear_marker() {}

    /*!
     *  @brief  element追加observer生成
     *  @param  func_is_invalid_records DOMアイテムチェック関数
     *  @param  func_filtering          フィルタリング関数
     */
    create_mutation_observer(func_is_invalid_records) {
        this.mutation_observer = new MutationObserver((records)=> {
            //
            this.callback_domelement_adition();
            //
            if (!this.storage.json.active) {
                return;
            }
            if (records.length == 0) {
                return; // なぜか空
            }
            var num_added_nodes = 0;
            records.forEach((rec)=> {
                num_added_nodes += rec.addedNodes.length;
            });
            if (num_added_nodes == 0) {
                return; // 追加なし
            }
            if (func_is_invalid_records(records)) {
                return; // 無効
            }
            this.current_location = new urlWrapper(location.href);
            this.call_filtering();
        });
    }

    /*!
     *  @brief  element追加observer準備
     *  @note   DOM構築完了後に追加される遅延elementもフィルタにかけたい
     *  @note   → observerでelement追加をhookしfiltering実行
     */
    ready_element_observer() {
        var elem = [];
        this.get_observing_node(elem);
        for (var e of elem) {
            this.mutation_observer.observe(e, {
                childList: true,
                subtree: true,
            });
        }
        return elem.length > 0;
    }

    start_element_observer() {
        if (this.observer_timer != null) {
            // 予約済みなら即3を叩いてみる
            // 1) storage.load
            // 2) DOMContentLoaded
            // 3) observeに監視対象element登録
            // 1で3を叩くも空振り(監視element未精製)、予約だけ行う
            // intarval中に2が発生、filtering空振り(対象element未生成)
            // intarval後再度3を叩くも、filtering対象elementは追加済み
            // というすっぽ抜け対策
            if (this.ready_element_observer()) {
                clearTimeout(this.observer_timer);
                this.observer_timer = null;
            }
        } else
        if (!this.ready_element_observer()) {
            // キーelementが見つからない場合は
            // "timeout"を使い生成できるまでretry
            // ※intervalより周期が安定的(らしい)
            const intv = 16; // ※1/60sec弱
            const func = ()=> {
                if (this.ready_element_observer()) {
                    clearTimeout(this.observer_timer);
                    this.observer_timer = null;
                } else {
                    this.observer_timer = setTimeout(func, intv);
                }
            };
            this.observer_timer = setTimeout(func, intv);
        }
    }

    callback_domloaded() {
        this.start_element_observer();
    }

    /*!
     *  @brief  フィルタリング
     */
    filtering() {
        this.call_filtering();
    }
    call_filtering() {
        if (!this.storage.json.active) {
            return;
        }
        this.filtering();
    }
}
