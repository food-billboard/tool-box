import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Typography, message, Space } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useState, useRef } from 'react';
import classnames from 'classnames'
// @ts-ignore
import ColorThief from '@/utils/lib/color-thief'
import Color from 'color'
import LinkList from '@/components/LinkList'
import { IMAGE_COLOR_LINK_LIST  } from '@/utils/Constants/LinkList'
import Config from './components/Config'
import type { ConfigRef } from './components/Config'
import styles from './index.less'

const { Dragger } = Upload;
const { Paragraph } = Typography

export default () => {

  const [ colorList, setColorList ] = useState<[number, number, number][]>([])
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ blobUrl, setBlobUrl ] = useState<string>('')

  const configRef = useRef<ConfigRef>(null)
  const colorThief = useRef<any>(new ColorThief())

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    setLoading(true)

    !!blobUrl && URL.revokeObjectURL(blobUrl)

    try {
      const newBlobUrl = URL.createObjectURL(file)
      setBlobUrl(newBlobUrl)
      const image = new Image()
      await new Promise((resolve, reject) => {
        image.onload = resolve 
        image.onerror = reject
        image.src = newBlobUrl
      })
      const { counter=5 } = configRef.current?.config || {}
      const mainColor = await colorThief.current.getColor(image)
      const similarColors = await colorThief.current.getPalette(image, counter)
      setColorList([
        mainColor,
        ...similarColors
      ])
    }catch(err) {
      message.info('获取颜色失败')
    }finally {
      setLoading(false)
    }

    return false 
  }, [blobUrl])

  return (
    <PageContainer
      ghost
      header={{
        title: '图片主题色获取',
      }}
      className={styles['image-color']}
    >
      <LinkList
        value={IMAGE_COLOR_LINK_LIST}
      />
      <Dragger 
        name={'file'}
        multiple={false}
        beforeUpload={onChange}
        disabled={loading}
        showUploadList={false}
        accept="image/*"
      >
        <p className={classnames(styles["image-color-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["image-color-text"]}>添加图片到这里</p>
      </Dragger>
      <Config
        ref={configRef}
      />
      <Space>
        {
          colorList.map((item, index) => {
            return (
              <div
                key={index}
                className={styles['image-color-list-item']}
              >
                <Paragraph 
                  copyable 
                  style={{
                    color: Color.rgb(item).string(),
                    fontWeight: index === 0 ? 'bold' : 'normal'
                  }}
                >
                  {Color(item).hex()}
                </Paragraph>
              </div>
            )
          })
        }
      </Space>
      {
        !!blobUrl && (
          <img
            src={blobUrl}
            width='100%'
            className='m-b-8'
          />
        )
      }
    </PageContainer>
  );
};
