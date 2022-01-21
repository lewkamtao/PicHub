import Moment from 'moment'
import axios from 'axios'

/**
 * 人性化时间处理 传入国际时间格式
 */
function getBeautifyTime(date) {
  var newdate = Moment(date).format('yyyy-MM-DD HH:mm:ss')
  var timestamp = new Date(newdate).getTime()
  var mistiming = Math.round(new Date() / 1000) - timestamp / 1000
  var postfix = mistiming > 0 ? '前' : '后'

  mistiming = Math.abs(mistiming)
  var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒']
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]
  for (var i = 0; i < 7; i++) {
    var inm = Math.floor(mistiming / arrn[i])
    if (inm != 0) {
      return inm + ' ' + arrr[i] + postfix
    }
  }
}

/**
 * 人性化时间处理 传入国际时间格式
 */
function getDate(date) {
  return Moment(date).format('yyyy年MM月DD日 HH:mm:ss')
}

/**
 * 得到文件的扩展名
 * @param {} filename
 */
function getFileExt(filename) {
  var d = /\.[^\.]+$/.exec(filename)
  var ext = new String(d)
  var s = ext.toLowerCase()
  return s
}

/**
 * 得到纯数字时间
 * @param {}
 */
function getNowTimeNum() {
  var nowTime = new Date()
  var year = nowTime.getFullYear()
  var month = nowTime.getMonth() + 1
  var day = nowTime.getDate()
  var hour = nowTime.getHours()
  var minutes = nowTime.getMinutes()
  var seconds = nowTime.getSeconds()
  if (hour <= 9) {
    hour = '0' + hour
  }
  if (minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds <= 9) {
    seconds = '0' + seconds
  }
  return (
    year.toString() +
    month.toString() +
    day.toString() +
    hour.toString() +
    minutes.toString() +
    seconds.toString()
  )
}

/**
 * 上传一个文件
 */
async function PUTObject(filePath, objectData) {
  // 初始化实例
  return new Promise((resolve) => {
    axios.get('https://cos.api.tngeek.com/GetFederationToken').then((res) => {
      axios
        .put(
          'https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com/' +
            filePath,
          objectData,
          {
            headers: {
              Authorization: res.data.data.Credentials.Token,
              'Content-Type': objectData.type,
            },
          }
        )
        .then((res) => {
          resolve(
            'https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com' +
              filePath
          )
        })
    })
  })
}

/**
 * 上传一个文件
 */
async function PUTPObjectByPrivate(filePath, objectData) {
  // 初始化实例
  return new Promise((resolve) => {
    axios.get('https://cos.api.tngeek.com/GetFederationToken').then((res) => {
      axios
        .put(
          'https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com/' +
            filePath,
          objectData,
          {
            headers: {
              Authorization: res.data.data.Credentials.Token,
              'Content-Type': objectData.type,
              'x-cos-acl': 'private',
            },
          }
        )
        .then((res) => {
          resolve(
            'https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com' +
              filePath
          )
        })
    })
  })
}
/**
 *  List Objects
 */
async function GETObjects(filePath) {
  // 初始化实例
  return new Promise((resolve) => {
    axios.get('https://cos.api.tngeek.com/GetFederationToken').then((res) => {
      axios
        .get(
          'https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com?delimiter=/&prefix=' +
            filePath,
          {
            headers: {
              Authorization: res.data.data.Credentials.Token,
            },
          }
        )
        .then((res) => {
          var jsonObj = parser.toJson(res.data)
          resolve(jsonObj)
        })
    })
  })
}

export default {
  getBeautifyTime,
  getFileExt,
  getNowTimeNum,
  PUTObject,
  GETObjects,
  getDate,
  PUTPObjectByPrivate,
}
