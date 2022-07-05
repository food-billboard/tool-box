import { useCallback, useMemo, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import color from 'color'
import { Card, Col, Row, InputNumber, Input, Space, Typography } from 'antd'
import classnames from 'classnames'
import { pick } from 'lodash'
import LinkList from '@/components/LinkList'
import ColorSelect from '@/components/ColorSelect'
import { COLOR_EXCHANGE_LINK_LIST } from '@/utils/Constants/LinkList'
import styles from './index.less'

const { Paragraph } = Typography

const ColorExchange = () => {

  const [ hexColor, setHexColor ] = useState<string>('f0f')
  const [ rgbColor, setRgbColor ] = useState<{ r: number, g: number, b: number }>({ r: 255, g: 0, b: 255 })

  const onColorChange = useCallback((value: any) => {
    const rgbColor = value.rgb 
    const hexColor = value.hex
    setHexColor(hexColor.slice(1))
    setRgbColor(pick(rgbColor, ['r', 'g', 'b']))
  }, [])

  const onRgbColorChange = useCallback((key: keyof typeof rgbColor, value: any) => {
    let realValue = parseInt(value)
    realValue = Number.isNaN(realValue) ? 0 : realValue 
    realValue = Math.max(0, Math.min(255, realValue))
    setRgbColor(prev => {
      return {
        ...prev,
        [key]: realValue
      }
    })
  }, [])

  const onHexColorChange = useCallback((e: any) => {
    setHexColor(e.target.value)
  }, [])

  const hexToRgbColor = useMemo(() => {
    try {
      const [ r, g, b ] = color(`#${hexColor}`).rgb().array()
      const rgbColor = `rgb(${r}, ${g}, ${b})`
      return (
        <div
          className={classnames(styles['color-exchange-value-container'])}
        >
          <div
            style={{
              backgroundColor: rgbColor,
              width: '1em',
              height: '1em'
            }}
            className='m-r-4'
          />
          <Paragraph 
            copyable
            style={{
              margin: 0
            }}
          >
            {rgbColor}
          </Paragraph>
        </div>
      )
    }catch(err) {
      return null 
    }
  }, [hexColor])

  const rgbToHexColor = useMemo(() => {
    try {
      const hexColor = color(rgbColor).hex()
      return (
        <div
          className={classnames(styles['color-exchange-value-container'])}
        >
          <div
            style={{
              backgroundColor: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
              width: '1em',
              height: '1em'
            }}
            className='m-r-4'
          />
          <Paragraph 
            copyable
            style={{
              margin: 0
            }}
          >
            {hexColor}
          </Paragraph>
        </div>
      )
    }catch(err) {
      return null 
    }
  }, [rgbColor])

  return (
    <PageContainer
      ghost
      header={{
        title: '颜色转换',
      }}
      className={styles['color-exchange']}
    >
      <LinkList
        value={COLOR_EXCHANGE_LINK_LIST}
      />
      <ColorSelect
        onChange={onColorChange}
        className='m-b-4'
      />
      <Row gutter={24} className='m-b-8'>
        <Col span={12}>
          <Card title="RGB -> HEX">
            <Space align="center" wrap>
              <InputNumber placeholder='R' value={rgbColor.r} onChange={onRgbColorChange.bind(null, 'r')} />
              <InputNumber placeholder='G' value={rgbColor.g} onChange={onRgbColorChange.bind(null, 'g')} />
              <InputNumber placeholder='B' value={rgbColor.b} onChange={onRgbColorChange.bind(null, 'b')} />
              {rgbToHexColor}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="HEX -> RGB">
            <Space align="center" wrap>
              <Input
                prefix='#'
                value={hexColor}
                onChange={onHexColorChange}
              />
              {hexToRgbColor}
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );

}

export default ColorExchange