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
    resolve({
      name: `${file.name.substring(
        0,
        file.name.lastIndexOf('.')
      )}_${createHash(6)}_.jpg`,
      orginal_size: file.size,
      compress_size: compressFile.size,
      base64data: base64File.replace('data:image/jpeg;base64,', ''),
      base64: base64File,
      folder: folder,
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

function createHash(hashLength) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

export { uploadHelper, fileByBase64 }
