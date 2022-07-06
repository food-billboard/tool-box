import {  } from 'react'
import { Space } from 'antd'
import classnames from 'classnames'
import styles from './index.less'

export type LinkValue = {
  url: string 
  title: string 
}

const LinkList = (props: {
  value?: LinkValue[]
}) => {

  const { value=[] } = props 

  return (
    <div
      className={classnames(styles['component-link-list'], 'm-b-4')}
    >
      <h4>优先使用轮子😊</h4>
      <Space
         className={styles['component-link-list-content']}
      >
        {
          value.map(item => {
            return (
              <div
                className="text-ellipsis"
                key={item.url}
              >
                <a target="_blank" href={item.url} title={item.title}>{item.title}</a>
              </div>
            )
          })
        }
      </Space>
    </div>
  )

}

export default LinkList