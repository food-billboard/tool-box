import { CSSProperties, useMemo } from 'react'
import { SketchPicker } from 'react-color'
import type { Color } from 'react-color'
import { Popover, Button } from 'antd'
import { useControllableValue } from 'ahooks'
import styles from './index.less'

const ColorSelect = (props: {
  value?: Color 
  onChange?: (value: Color) => void 
  className?: string 
  style?: CSSProperties
}) => {

  const { className, style } = props 

  const [ value, setValue ] = useControllableValue(props)

  const colorSelect = useMemo(() => {
    return (
      <SketchPicker
        color={value}
        onChangeComplete={value => {
          setValue(value)
        }}
      />
    )
  }, [value, setValue])
  

  return (
    <Popover
      content={colorSelect}
      trigger='click'
      overlayClassName={styles['component-color-select-tooltip']}
    >
      <Button
        className={className}
        style={style}
      >
        选择颜色
      </Button>
    </Popover>
  )

}

export default ColorSelect