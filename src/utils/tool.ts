
export function fileSize(size: number) {
  if(size < 1024) {
    return size + 'b'
  }
  if(size >= 1024 && size < 1024 * 1024) {
    return Math.floor(size / 1024) + 'kb'
  }
  if(size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
    return Math.floor(size / 1024 / 1024) + 'mb'
  }
  return Math.floor(size / 1024 / 1024 / 1024) + 'gb'
}