import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import util from './util'

// 自定义全局的格式化处理函数
VXETable.formats.mixin({
  // 格式化性别
  formatSex({ cellValue }) {
    return cellValue ? (cellValue === '1' ? '男' : '女') : ''
  },
  // 标签
  formatTagsObj({ cellValue }) {
    var tags = cellValue.map((tag) => {
      return `<span class="tag">${tag.value}</span>`
    })

    return tags.join('')
  },
  // 标签
  formatTags({ cellValue }) {
    var tags = cellValue.map((tag) => {
      return `<span class="tag">${tag}</span>`
    })

    return tags.join('')
  },
  // 用户类型
  formatUserType({ cellValue }) {
    switch (cellValue) {
      case 'general':
        return '用户'
      case 'administrator':
        return '管理员'
      default:
        return '未知'
    }
  },
  // 格式化状态
  formatStatus({ cellValue }) {
    return cellValue
      ? cellValue === 101
        ? '<span class="tag tag-101">正常</span>'
        : '<span class="tag tag-201">未启用</span>'
      : ''
  },
  // 人性化时间
  formatDateBeautify({ cellValue }) {
    return util.getBeautifyTime(cellValue)
  },
  // 格式化日期，默认 yyyy-MM-dd HH:mm:ss
  formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
  },

  // 四舍五入金额，每隔3位逗号分隔，默认2位数
  formatAmount({ cellValue }, digits = 2) {
    return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits })
  },
  // 格式化银行卡，默认每4位空格隔开
  formatBankcard({ cellValue }) {
    return XEUtils.commafy(XEUtils.toString(cellValue), {
      spaceNumber: 4,
      separator: ' ',
    })
  },
  // 四舍五入,默认两位数
  formatFixedNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
  },
  // 向下舍入,默认两位数
  formatCutNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits)
  },
  // 转换 moment 类型为字符串
  toMomentString({ cellValue }, format) {
    return cellValue ? cellValue.format(format) : ''
  },
})
