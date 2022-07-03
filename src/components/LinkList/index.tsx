import {  } from 'react'
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
      className={styles['component-link-list']}
    >
      <h4>优先使用轮子😊</h4>
      <ul
         className={styles['component-link-list-content']}
      >
        {
          value.map(item => {
            return (
              <li
                className="text-ellipsis"
                key={item.url}
              >
                <a target="_blank" href={item.url} title={item.title}>{item.title}</a>
              </li>
            )
          })
        }
      </ul>
    </div>
  )

}

export default LinkList