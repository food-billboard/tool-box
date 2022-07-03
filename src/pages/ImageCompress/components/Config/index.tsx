import { forwardRef, useImperativeHandle } from 'react'

export type ConfigType = {
  quality: number 
}

export type ConfigRef = {
  config: ConfigType
}

const Config = forwardRef<ConfigRef, {
  onChange?: (config: ConfigType) => void 
}>((props, ref) => {

  const {  } = props 

  return (
    <div>

    </div>
  )

})

export default Config