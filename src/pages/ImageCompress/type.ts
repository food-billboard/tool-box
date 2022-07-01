import type { RcFile } from 'antd/es/upload/interface'

export type ImageCompressData = {
  id: string 
  file: RcFile
  originFile: File 
  compressFile: File | null 
  prevSize: number 
  compressSize: number 
}