import { useMemo } from 'react'
import { SketchPicker } from 'react-color'
import type { Color } from 'react-color'
import { Tooltip, Button } from 'antd'
import { useControllableValue } from 'ahooks'

const ColorSelect = (props: {
  value?: Color 
  onChange?: (value: Color) => void 
}) => {

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
    <Tooltip
      title={colorSelect}
    >
      <Button>
        选择颜色
      </Button>
    </Tooltip>
  )

}

export default ColorSelect