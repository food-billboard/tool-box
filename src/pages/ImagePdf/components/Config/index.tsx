import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Form, InputNumber } from 'antd'
import { merge } from 'lodash'

export type ConfigType = {
  counter: number 
}

export type ConfigRef = {
  config: ConfigType
}

const Config = forwardRef<ConfigRef, {
  onChange?: (config: ConfigType) => void 
}>((props, ref) => {

  const { onChange } = props 
  const [ config, setConfig ] = useState<ConfigType>({ counter: 5 })
  const [form] = Form.useForm()

  const onConfigChange = useCallback((changeValue: any, values: any) => {
    setConfig(prev => {
      const newConfig = merge({}, prev, changeValue)
      onChange?.(newConfig)
      return newConfig
    })
  }, [onChange])

  useImperativeHandle(ref, () => {
    return {
      config
    }
  }, [config])

  return (
    <Form
      wrapperCol={{ span: 14 }}
      layout={'horizontal'}
      form={form}
      initialValues={{
        counter: 5
      }}
      onValuesChange={onConfigChange}
      className='m-tb-8'
    >
      <Form.Item label="相近颜色获取数量" name='counter'>
        <InputNumber />
      </Form.Item>
    </Form>
  )

})

export default Config