import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Form, Radio, Switch } from 'antd'
import { merge } from 'lodash'

export type ConfigType = {
  orientation: 'p' | 'l' 
  compressPdf: boolean 
}

export type ConfigRef = {
  config: ConfigType
}

const Config = forwardRef<ConfigRef, {
  onChange?: (config: ConfigType) => void 
}>((props, ref) => {

  const { onChange } = props 
  const [ config, setConfig ] = useState<ConfigType>({ 
    orientation: 'p',
    compressPdf: false 
  })
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
        orientation: 'p',
        compressPdf: false 
      }}
      onValuesChange={onConfigChange}
      className='m-tb-8'
    >
      <Form.Item label="pdf方向" name='orientation'>
        <Radio.Group 
          options={[
            {
              label: '竖直',
              value: 'p'
            },
            {
              label: '水平',
              value: 'l'
            }
          ]}
        />
      </Form.Item>
      <Form.Item label="是否压缩" name='compressPdf' valuePropName='checked' >
        <Switch />
      </Form.Item>
    </Form>
  )

})

export default Config