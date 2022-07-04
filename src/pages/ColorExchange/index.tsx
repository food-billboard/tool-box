import { useCallback, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import color from 'color'
import { Card, Col, Row, InputNumber, Input } from 'antd'
import type { Color } from 'react-color'
import LinkList from '@/components/LinkList'
import ColorSelect from '@/components/ColorSelect'
import { COLOR_EXCHANGE_LINK_LIST } from '@/utils/Constants/LinkList'
import styles from './index.less'

const ColorExchange = () => {

  const [ hexColor, setHexColor ] = useState<string>('#f0f')
  const [ rgbColor, setRgbColor ] = useState<{ r: number, g: number, b: number }>({ r: 255, g: 0, b: 255 })

  const onColorChange = useCallback((value: Color) => {
    console.log(value, 22222)
  }, [])

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
      />
      <Row gutter={24}>
        <Col span={12}>
          <Card title="RGB -> HEX">
            Card content
          </Card>
        </Col>
        <Col span={12}>
          <Card title="HEX -> RGB">
            Card content
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );

}

export default ColorExchange