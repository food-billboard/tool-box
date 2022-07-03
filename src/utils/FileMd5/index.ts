import { ArrayBuffer as SparkMD5ArrayBuffer } from 'spark-md5'

const CHUNK_SIZE = 1024 * 1024 * 5

export default async function fileMd5(file: File, onMd5: (chunk: ArrayBuffer, index: number, total: number) => void) {

  const spark = new SparkMD5ArrayBuffer()
  const size = file.size
  const fileReader = new FileReader()

  let currentChunk:number = 0;
  const totalChunks: number = Math.ceil(size / CHUNK_SIZE)

  //文件内容读取
  async function loadNext(): Promise<string> {
    let start: number = currentChunk * CHUNK_SIZE,
        end: number = currentChunk + 1 === totalChunks ? size : (currentChunk + 1) * CHUNK_SIZE,
        chunk: Blob;

    chunk = file.slice(start, end)

    await new Promise((resolve, reject) => {
      fileReader.onload = function(e) {
        const result = e.target?.result
        if(result) {
          resolve(result)
        }else {
          reject()
        }
      }
      fileReader.onerror = function() {
        reject()
      }
      fileReader.readAsArrayBuffer(chunk)
    })
    .then(result => {
      spark.append(result as ArrayBuffer)
      onMd5(result as ArrayBuffer, currentChunk, totalChunks)
    })

    currentChunk ++ 

    if(currentChunk < totalChunks) {
      return loadNext()
    }else {
      const md5 = spark.end()
      spark.destroy()
      return md5  
    }

  }

  return loadNext()

}