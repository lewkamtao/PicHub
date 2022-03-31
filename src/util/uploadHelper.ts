import Compress from '@yireen/squoosh-browser'
import {
  defaultPreprocessorState,
  defaultProcessorState,
  encoderMap,
} from '@yireen/squoosh-browser/dist/client/lazy-app/feature-meta'

// type可选 mozJPEG / avif / webP
const uploadHelper = (file, folder) => {
  return new Promise(async (resolve) => {
    const compress = new Compress(file, {
      encoderState: {
        type: 'mozJPEG',
        options: encoderMap.mozJPEG.meta.defaultOptions,
      },
      processorState: defaultProcessorState,
      preprocessorState: defaultPreprocessorState,
    })
    const compressFile = await compress.process()
    const base64File: any = await fileByBase64(compressFile)
    const orginal_base64: any = await fileByBase64(file)

    resolve({
      name: `${file.name.substring(0, file.name.lastIndexOf('.'))}_${createHash(
        6
      )}`,
      orginal_size: file.size,
      compress_size: compressFile.size,
      base64data: base64File.replace(/^data:image\/\w+;base64,/, ''),
      base64: base64File,
      orginal_base64data: orginal_base64.replace(
        /^data:image\/\w+;base64,/,
        ''
      ),
      orginal_base64: orginal_base64,
      folder: folder,
      ext: getFileExtendingName(file.name),
    })
  })
}
/**
 * 上传附件转base64
 * @param {File} file 文件流
 */
const fileByBase64 = (file) => {
  return new Promise(async (resolve) => {
    var reader = new FileReader()
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file)
    reader.onload = function (e: any) {
      // target.result 该属性表示目标对象的DataURL
      resolve(e.target.result)
    }
  })
}

/**
 * 获取文件扩展名
 * @param {String} filename 文件流
 */
function getFileExtendingName(filename) {
  // 文件扩展名匹配正则
  var reg = /\.[^\.]+$/
  var matches = reg.exec(filename)
  if (matches) {
    return matches[0]
  }
  return ''
}

function createHash(hashLength) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

export { uploadHelper, fileByBase64 }
