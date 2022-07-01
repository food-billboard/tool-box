import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export const downloadFile = (file: File, filename?: string) => {
  return saveAs(file, filename)
}

export const packFileAndDownload = async (files: File[], filename?: string) => {
  const zip = new JSZip() 
  const folder = zip.folder(filename || `文件_${Date.now()}.zip`)
  files.forEach(file => {
    folder?.file(file.name, file)
  })
  return folder?.generateAsync({ type: 'blob' }) 
  .then(data => {
    return saveAs(data, folder.name)
  })
}