
export default class TaskPool {

  constructor(limitPool: number=10) {
    this.MAX_POOL = limitPool
  }

  MAX_POOL

  pending: any[][] = []
  dealingCounter = 0 

  enqueue = (callback: Function, resolve: (success: boolean, result?: any) => void) => {
    if(!callback) return 
    if(this.dealingCounter < this.MAX_POOL) {
      this.dealCallback(callback, resolve)
    }else {
      this.pending.push([callback, resolve])
    }
  }

  dealCallback = async (callback: Function, resolve: (success: boolean, result?: any) => void) => {
    this.dealingCounter ++
    let success = true 
    let result: any 
    return callback()
    .then((data: any) => {
      result = data 
    })
    .catch((error: any) => {
      console.error(error)
      success = false  
    })
    .then(() => {
      this.dealingCounter -- 
    })
    .then(() => {
      resolve(success, result)
      if(this.pending.length) {
        const [ target ] = this.pending
        this.dealCallback(target[0], target[1])
        this.pending = this.pending.slice(1)
      }
    })
  }

  clear = () => {
    this.pending = [] 
    this.dealingCounter = 0 
  }

}