<template>
    <li class="market_list_item" :class="itemClasses">
        <div class="item_left">
            <div :class="sourceClasses"></div>
        </div>
        <div class="item_right">
            <div class="item_right_top">
                <StockName
                    :val="item.stock_name"
                    class="item_right_top_name"
                />
                <Price
                    :val="_price"
                    :price_change="_price_change"
                    :stock_type="_stock_type"
                    :symbol_type="_symbol_type"
                    :source="_source"
                    class="item_right_top_price"
                />
            </div>
            <div class="item_right_bottom">
                <StockCode
                    :val="item.code"
                    :source="_source"
                    class="item_right_bottom_code"
                />
                <PriceChange
                    :val="_price_change"
                    :stock_type="_stock_type"
                    :symbol_type="_symbol_type"
                    :source="_source"
                    :price="_price"
                    class="item_right_bottom_changeValue"
                />
                <PriceChangeRate
                    :val="item.price_change_rate"
                    :price_change="_price_change"
                    :stock_type="_stock_type"
                    :symbol_type="_symbol_type"
                    :source="_source"
                    :price="_price"
                    class="item_right_bottom_changeRate"
                />
            </div>
        </div>
    </li>
</template>

<script>
    import Price from '@formatter/market-base/Price'
    import PriceChange from '@formatter/market-base/PriceChange'
    import PriceChangeRate from '@formatter/market-base/PriceChangeRate'
    import StockCode from '@formatter/market-base/StockCode'
    import StockName from '@formatter/market-base/StockName'

    export default {
        name: 'StockItem',
        components: {
            Price,
            PriceChange,
            PriceChangeRate,
            PriceChangeRate,
            StockCode,
            StockName,
        },
        computed: {
            sourceClasses() {
                const maps = {
                    'sh': 'sh-bg',
                    'sz': 'sz-bg',
                    'hk': 'hk-bg',
                }
                let bgClass = maps[this._source]

                return [bgClass]
            },
            _price() {
                return this.item.price
            },
            _price_change() {
                return this.item.price_change
            },
            _source() {
                return this.item.source
            },
            _symbol_type() {
                return this.item.symbol_type
            },
            _stock_type() {
                return this.item.stock_type
            },
            itemClasses() {
                return [this.item.classColor]
            },
        },
        props: {
            item: {
                type: Object,
                required: true,
                default: {},
            },
        },
    }
</script>

<style lang="less">
    .market_list_item {
        display: flex;
        height: 45px;
        font-size: 12px;
        cursor: pointer;
        .item_left {
            flex: 0 0 15px;
        }
        .item_right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 12px;
            padding: 3px 8px;
        }
        .item_right_bottom_code {
            color: #828282;
        }
        .bg-common() {
            height: 12px;
            line-height: 12px;
            opacity: .8;
            color: var(--color-white);
            margin-top: 3px;
        }
        .sz-bg {
            background-color: #D81E06;
            .bg-common();
            &:after {
                content: 'SZ';
                text-align: center;
            }
        }
        .sh-bg {
            background-color: #BD10E0;
            .bg-common();
            &:after {
                content: 'SH';
                text-align: center;
            }
        }
        .hk-bg {
            background-color: #4D70EB;
            .bg-common();
            &:after {
                content: 'HK';
                text-align: center;
            }
        }
        .item_right_top {
            display: flex;
            justify-content: space-between;
        }
        .item_right_bottom {
            display: flex;
            justify-content: space-between;
        }
        .item_right_top_name {
            font-size: 13px;
        }
        .item_right_top_price {
            font-size: 14px;
        }
    }
</style>
