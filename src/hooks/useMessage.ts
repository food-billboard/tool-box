import { useEffect } from 'react'
import { message } from 'antd'

export default function useMessage() {

  useEffect(() => {
    message.info('优先使用轮子😊')
  }, [])

}