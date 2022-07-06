import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Button, Form, InputNumber, Switch } from 'antd'
import { merge } from 'lodash'

export type ConfigType = {
  'auto-size': boolean 
  width: number 
  height: number 
  offset: number 
  captureSecond: number 
  captureAll: boolean 
}

export type ConfigRef = {
  config: ConfigType
}

const Config = forwardRef<ConfigRef, {
  onChange?: (config: ConfigType) => void 
  url?: string 
  onReCall?: () => void 
}>((props, ref) => {

  const { onChange, url, onReCall } = props 
  const [ config, setConfig ] = useState<ConfigType>({
    'auto-size': true,
    width: 200,
    height: 200,
    offset: 0,
    captureSecond: 1,
    captureAll: false 
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

  let autoSize = form.getFieldValue('auto-size')
  autoSize = typeof autoSize === 'boolean' ? autoSize : true 

  return (
    <Form
      wrapperCol={{ span: 14 }}
      layout={'inline'}
      form={form}
      initialValues={{
        'auto-size': true,
        width: 200,
        height: 200,
        offset: 0,
        captureSecond: 1,
        captureAll: false 
      }}
      onValuesChange={onConfigChange}
      className='m-tb-8'
    >
      <Form.Item label="全屏截取" name='auto-size' valuePropName='checked'>
        <Switch />
      </Form.Item>
      {
        !autoSize && (
          <Form.Item label="宽" name='width'>
            <InputNumber />
          </Form.Item>
        )
      }
      {
        !autoSize && (
          <Form.Item label="高" name='height'>
            <InputNumber />
          </Form.Item>
        )
      }
      <Form.Item label="延迟截取（秒）" name='offset'>
        <InputNumber />
      </Form.Item>
      <Form.Item label="截取完整视频" name='captureAll' valuePropName='checked'>
        <Switch />
      </Form.Item>
      {
        !form.getFieldValue('captureAll') && (
          <Form.Item label="截取时间（秒）" name='captureSecond'>
            <InputNumber />
          </Form.Item>
        )
      }
      <Button
        disabled={!url}
        type='primary'
        onClick={onReCall}
      >
        重新截取
      </Button>
    </Form>
  )

})

export default Config