import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Typography } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useState } from 'react';
import classnames from 'classnames'
import LinkList from '@/components/LinkList'
import { FileMd5 } from '@/utils'
import { FILE_MD5_LINK_LIST  } from '@/utils/Constants/LinkList'
import type {  } from './type'
import styles from './index.less'

const { Dragger } = Upload;
const { Paragraph } = Typography

export default () => {

  const [ actionList, setActionList ] = useState<string[]>([])
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ md5, setMd5 ] = useState<string>('')

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    let timestamps = Date.now()
    setLoading(true)
    setMd5('')
    setActionList([
      `开始计算，文件名: (${file.name})`
    ])

    try {
      const md5 = await FileMd5(file, (chunk, index, total) => {
        setActionList(prev => {
          return [
            `加载数据：第${index+1}部分，总${total}部分`,
            ...prev
          ]
        })
      })
      setMd5(md5)
      setActionList(prev => {
        return [
          `计算耗时：${Date.now() - timestamps}ms`,
          `计算成功，MD5值：${md5}`,
          ...prev
        ]
      })
    }catch(err) {
      setActionList(prev => {
        return [
          `计算耗时：${Date.now() - timestamps}ms`,
          '计算失败',
          ...prev
        ]
      })
    }finally {
      setLoading(false)
    }

    return false 
  }, [])

  return (
    <PageContainer
      ghost
      header={{
        title: '文件md5在线计算',
      }}
      className={styles['file-md5']}
    >
      <LinkList
        value={FILE_MD5_LINK_LIST}
      />
      <Dragger 
        name={'file'}
        multiple={false}
        beforeUpload={onChange}
        disabled={loading}
        showUploadList={false}
      >
        <p className={classnames(styles["file-md5-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["file-md5-text"]}>添加文件到这里</p>
      </Dragger>
      <div
        className={styles['file-md5-result']}
      > 
        {
          !loading && !!md5 && (
            <Paragraph copyable>{md5}</Paragraph>
          ) 
        }
      </div>
      <div
        className={(styles['file-md5-action-list'])}
      >
        {
          actionList.map(item => {
            return (
              <div
                key={item}
                className={styles['file-md5-action-list-item']}
              >
                {item}
              </div>
            )
          })
        }
      </div>
    </PageContainer>
  );
};
