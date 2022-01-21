import COS from 'cos-js-sdk-v5'

import axios from 'axios'

var cos = new COS({
  // 必选参数
  getAuthorization: function (options, callback) {
    axios.get('https://cos.api.tngeek.com/GetFederationToken').then((res) => {
      var data = res.data.data
      callback({
        TmpSecretId: data.Credentials.TmpSecretId,
        TmpSecretKey: data.Credentials.TmpSecretKey,
        SecurityToken: data.Credentials.Token,
        ExpiredTime: data.ExpiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
      })
    })
  },
})

async function GETObjects({ Prefix, marker, pageSize }) {
  return new Promise((resolve) => {
    cos.getBucket(
      {
        Bucket: 'tngeek-mall-1255310647' /* 必须 */,
        Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
        Prefix: Prefix /* 非必须 */,
        Delimiter: '/',
        Marker: marker || '',
        MaxKeys: pageSize || 100,
      },
      function (err, data) {
        resolve(err || data)
      }
    )
  })
}

export default {
  GETObjects,
}
