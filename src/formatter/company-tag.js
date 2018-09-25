import {
    isNumber,
} from './utility.js'
import {
    dataFixed,
} from '@c/utils/util.js'

const companyTagFormatter = {
    zyyx_score(value, list) {
        var val = isNumber(value) ? Number(value).toFixed(1) : '--'
        var get_class = companyTagFormatter.get_zyyx_score_class(
            list.stock_status,
            list.stock_count
        )
        var className = val === '--' ? 'point-default' : ''

        return (
            '<div class="tag-ico j-tag font20 ' +
            className +
            ' ' +
            get_class +
            '">' +
            val +
            '</div>'
        )
    }, // 确定性评分
    get_probative_term(val) {
        return isNumber(val)
            ? "<div class='tag-ico-authen'><div class='tag-ico-authen-num'>" + val + '</div></div>'
            : ''
    },
    get_zyyx_score_class(now, total) {
        if (isNumber(now) && isNumber(total)) {
            var percentage = now / total
            if (percentage <= 0.2) {
                // 前20
                return 'bg-linear-red'
            } else if (percentage >= 0.8) {
                // 后20
                return 'bg-green'
            } else {
                return 'bg-blue'
            }
        } else {
            return 'bg-blue'
        }
    },
    tags(value, row) {
        var innerClass = ''
        var outerClass = ''
        var content = ''

        if (value === 2) {
            outerClass = 'bg-linear-red'
            innerClass = 'good-honor'
        } else if (value === 1) {
            outerClass = 'bg-yellow'
            innerClass = 'hope-honor'
        } else if (value === -1) {
            outerClass = 'bg-gray'
            innerClass = 'common-honor'
        } else {
            outerClass = 'bg-gray point-default'
            content = '--'
        }
        // 获取鉴定季
        var get_authenticate_class = companyTagFormatter.get_probative_term(row.tags_quarter)

        return (
            '<div class="tag-ico j-tag ' +
            outerClass +
            '"><div class="tag-inner ' +
            innerClass +
            '">' +
            content + '</div>' +
            get_authenticate_class +
            '</div>'
        )
    }, //公司荣誉
    future_achievement_appraise(value, row) {
        var className = "", val = "";
        if (row.clear === 1) {
            val = '--'
            className = "bg-gray point-default";
        } else if (value == '超预期') {
            val = "可能超预期";
            className = "bg-linear-red";
        } else if (value == '符合预期') {
            val = '可能符合预期'
            className = 'bg-linear-red'
        } else if (value == '低于预期') {
            val = '可能低于预期'
            className = 'bg-green'
        } else {
            if (row.original_text == '2') {
                val = '近期无线索'
                className = 'bg-gray'
            } else {
                val = '近一年无线索'
                className = 'bg-gray'
            }
        }
        if (val.length >= 4) {
            className += ' two-line'
            var l = Math.floor(val.length / 2)
            val = val.substr(0, l) + '<br>' + val.substr(l)
        }

        return '<div class="tag-ico j-tag ' + className + '">' + val + '</div>'
    }, // 业绩预判
    history_achievement_appraise(value, ele) {
        var current = ele.current_period_appraise

        if (['超预期', '符合预期', '低于预期', '--', null].indexOf(current) > -1) {
            return companyTagFormatter.get_company_future_appraise(
                current,
                ele.current_period_quarter,
                ele,
            )
        } else {
            return companyTagFormatter.get_company_history_appraise(
                value,
                ele.current_period_quarter_up,
                ele,
            )
        }
    }, // 业绩鉴定
    get_company_history_appraise: function(value, expect, data) {
        var txt = ''
        var class_name = ''
        if (data.clear === 1) {
            txt = '--'
            class_name = "bg-gray point-default";
        } else if (!value || ['--'].indexOf(value) > -1) {
            txt = '无法鉴定'
            class_name = 'bg-gray'
        } else {
            txt = value
            if (['超预期', '符合预期'].indexOf(txt) > -1) {
                class_name = 'bg-linear-red'
            } else if (txt === '低于预期') {
                class_name = 'bg-green'
            } else if (txt === '暂未判断') {
                txt = '暂未鉴定'
                class_name = 'bg-gray'
            } else {
                class_name = 'bg-gray'
            }
        }
        var get_authenticate_class = this.get_probative_term(expect)
        if (txt && txt.length >= 4) {
            class_name += ' two-line'
            var l = Math.floor(txt.length / 2)
            txt = txt.substr(0, l) + '<br>' + txt.substr(l)
        }
        return (
            '<div class="tag-ico j-tag history_appraise ' +
            class_name +
            '">' +
            txt +
            get_authenticate_class +
            '</div>'
        )
    },
    get_company_future_appraise: function(value, expect, data) {
        var txt = '',
            class_name = ''
        if (data.clear === 1) {
            txt = '--'
            class_name = "bg-gray point-default";
        } else if (value === '--' || !value) {
            txt = '无法鉴定'
            class_name = 'bg-gray'
        } else {
            txt = value
            if (['超预期', '符合预期'].indexOf(value) > -1) {
                class_name = 'bg-linear-red'
            } else if (value === '低于预期') {
                class_name = 'bg-green'
            } else {
                class_name = 'bg-gray'
            }
        }
        var get_authenticate_class = this.get_probative_term(expect)
        if (txt.length >= 4) {
            class_name += ' two-line'
            var l = Math.floor(txt.length / 2)
            txt = txt.substr(0, l) + '<br>' + txt.substr(l)
        }
        return (
            '<div class="tag-ico j-tag future_appraise ' +
            class_name +
            '">' +
            txt +
            get_authenticate_class +
            '</div>'
        )
    },
    hold_change(value) {
        var className = ''
        if (isNumber(value)) {
            value = Number(value)
            if (value === -999) {
                className = 'point-default'
                value = '--'
            } else {
                className = 'two-line'
                value = dataFixed(value)
                value =
                    '<div class="tag-num font16">' +
                    value +
                    '</div>' +
                    '<div class="tag-suffix">%</div>'
            }
        } else {
            className = 'point-default'
            value = '--'
        }
        return '<div class="tag-ico j-tag bg-blue ' + className + '">' + value + '</div>'
    }, // 机构持仓
    business_status_new(value, data) {
        value = value || '--'
        var className = ''
        if (data.clear === 1) {
            className = 'bg-blue point-default'
        } else if (["行业龙头", "子行业龙头"].indexOf(value) > -1) {
            className = "bg-linear-red";
        } else {
            className = 'bg-blue'
        }

        if (value.length >= 4) {
            className += ' two-line'
            var l = Math.floor(value.length / 2)
            value = value.substr(0, l) + '<br>' + value.substr(l)
        }

        return '<div class="tag-ico j-tag ' + className + '">' + value + '</div>'
    }, //行业地位
    industry_appraise(value, ele) {
        if (
            ['超预期', '符合预期', '低于预期', '--', null].indexOf(ele.industry_appraise_newest) >
            -1
        ) {
            return companyTagFormatter.get_industry_appraise(
                ele.industry_appraise_newest,
                '未来',
                ele.industry_appraise_quarter,
                ele,
            )
        } else {
            return companyTagFormatter.get_industry_appraise(
                value,
                '历史',
                ele.industry_appraise_quarter_up,
                ele,
            )
        }
    }, // 行业业绩
    get_industry_appraise(value, season, expect, data) {
        var class_name = season === "未来" ? "future_appraise" : "history_appraise";
        var get_authenticate_class = this.get_probative_term(expect);
        if (data.clear === 1) {
            class_name += ' bg-gray point-default'
            value = '--'
        } else if (["超预期", "符合预期"].indexOf(value) > -1) {
            class_name += ' bg-linear-red';
        } else if (value === '低于预期') {
            class_name += ' bg-green'
        } else {
            value = '无法鉴定'
            class_name += ' bg-gray'
        }

        if (value.length >= 4) {
            class_name += ' two-line'
            var l = Math.floor(value.length / 2)
            value = value.substr(0, l) + '<br>' + value.substr(l)
        }
        return (
            '<div class="tag-ico j-tag ' +
            class_name +
            '">' +
            value +
            get_authenticate_class +
            '</div>'
        )
    },
    financing_securities_loan(value) {
        var className = '',
            suffix = ''
        var ten_thousand = Math.pow(10, 8)
        var ten_hundred = Math.pow(10, 4)

        if (isNumber(value)) {
            value = Number(value)
            if (value >= ten_thousand) {
                value = (value / ten_thousand).toFixed(2)
                suffix = '亿'
                className = 'two-line'
            } else if (value >= ten_hundred) {
                value = (value / ten_hundred).toFixed(2)
                suffix = '万'
                className = 'two-line'
            } else {
                value = value.toFixed(2)
                className = 'one-line'
            }
        } else {
            value = '--'
            className = 'one-line point-default'
        }

        return (
            '<div class="tag-ico j-tag bg-blue ' +
            className +
            '"><div class="tag-num font16">' +
            value +
            '</div>' +
            (suffix ? '<div class="tag-suffix">' + suffix + '</div>' : '') +
            '</div>'
        )
    }, // 融资融券
    hold_percent(value) {
        var className
        if (isNumber(value)) {
            className = 'two-line '
            value = Number(value)
            value = dataFixed(value, 2)
            value =
                '<div class="tag-num font16">' +
                value +
                '</div>' +
                '<div class="tag-suffix">%</div>'
        } else {
            className = 'point-default'
            value = '--'
        }
        return '<div class="tag-ico j-tag bg-blue ' + className + '">' + value + '</div>'
    }, // 互联互通
    success_rate(value, list) {
        var className, val

        if (list.clear === 1) {
            val = '--'
            className = "point-default bg-gray";
        } else if (value == null || value == -999) {
            val = '样本<br>不足'
            className = 'two-line point-default bg-gray'
        } else if (value >= 0.8) {
            val = '很高'
            className = 'bg-linear-red'
        } else if (value >= 0.7) {
            val = '较高'
            className = 'bg-linear-red'
        } else if (value > 0.3) {
            val = '一般'
            className = 'bg-gray'
        } else if (value > 0.2) {
            val = '较低'
            className = 'bg-green'
        } else if (value <= 0.2) {
            val = '很低'
            className = 'bg-green'
        } else {
            className = 'point-default bg-gray'
            val = '--'
        }

        var get_authenticate_class = companyTagFormatter.get_probative_term(
            list.success_rate_quarter
        )

        return (
            '<div class="tag-ico j-tag ' +
            className +
            '">' +
            val +
            get_authenticate_class +
            '</div>'
        )
    }, // 季度胜率
    industry_future(value, data) {
        var class_name
        if (data.clear === 1) {
            class_name = 'bg-gray point-default'
        } else if (['可能超预期', '业绩上调', '可能符合预期'].indexOf(value) > -1) {
            class_name = 'bg-linear-red'
        } else if (['可能低于预期', '业绩下调'].indexOf(value) > -1) {
            class_name = 'bg-green'
        } else {
            class_name = 'bg-gray'
        }

        value = value || '--'
        if (value.length >= 4) {
            class_name += ' two-line'
            var l = Math.floor(value.length / 2)
            value = value.substr(0, l) + '<br>' + value.substr(l)
        }

        return '<div class="tag-ico j-tag ' + class_name + '">' + value + '</div>'
    }, // 行业预判
    industry_periodicity(value) {
        var result
        var class_name
        switch (value) {
            case 1:
                result = '非周期性'
                class_name = 'period-not'
                break
            case 2:
                result = '弱周期性'
                class_name = 'period-weak'
                break
            case 3:
                result = '较强周期'
                class_name = 'period-more-strong'
                break
            case 4:
                result = '强周期性'
                class_name = 'period-most-strong'
                break
            default:
                result = '--'
                class_name = 'point-default bg-blue'
                break
        }

        if (result.length >= 4) {
            class_name += ' two-line'
            var l = Math.floor(result.length / 2)
            result = result.substr(0, l) + '<br>' + result.substr(l)
        }

        return '<div class="tag-ico j-tag ' + class_name + '">' + result + '</div>'
    }, // 行业周期
    periodicity(value) {
        var result = '--'
        var class_name = 'point-default'
        if (value && typeof value == 'object' && value.length) {
            result = ''
            class_name = ''
            value.sort(function(a, b) {
                return a - b
            })
            var first_line = false
            var can_split_two_line = true
            for (var i = 0; i < value.length; i++) {
                switch (value[i]) {
                    case 1:
                        result += '非周期'
                        first_line = true
                        break
                    case 2:
                        result += '弱周期'
                        first_line = true
                        break
                    case 3:
                        result += '较强周期'
                        first_line = true
                        break
                    case 4:
                        result += '强周期'
                        first_line = true
                        break
                    case 5:
                        // 手动分行
                        if (first_line) {
                            result += '<br>'
                        }
                        result += '价值'
                        if (first_line) {
                            result += '股'
                            class_name += ' two-line'
                            can_split_two_line = false
                        }
                        break
                    case 6:
                        // 手动分行
                        if (first_line) {
                            result += '<br>'
                        }
                        result += '成长'
                        if (first_line) {
                            result += '股'
                            class_name += ' two-line'
                            can_split_two_line = false
                        }
                        break
                    default:
                        break
                }
            }
            if (can_split_two_line && result.length >= 4) {
                class_name += ' two-line'
                var l = Math.floor(result.length / 2)
                result = result.substr(0, l) + '<br>' + result.substr(l)
            }
        }

        return '<div class="tag-ico j-tag bg-blue ' + class_name + '">' + result + '</div>'
    }, //个股风格
    over_rate(value, row) {
        var className
        if (isNumber(value)) {
            className = 'two-line '
            value = Number(value)
            value = dataFixed(value * 100)
            className += value > 0 ? 'bg-linear-red' : value < 0 ? 'bg-green' : 'bg-gray'
            value =
                '<div class="tag-num font16">' +
                value +
                '</div>' +
                '<div class="tag-suffix">%</div>'
        } else {
            className = 'point-default bg-gray'
            value = '--'
        }

        var get_authenticate_class = companyTagFormatter.get_probative_term(
            row.success_rate_quarter
        )
        return (
            '<div class="tag-ico j-tag ' +
            className +
            '">' +
            value +
            get_authenticate_class +
            '</div>'
        )
    }, // 超额收益
}

export default companyTagFormatter
