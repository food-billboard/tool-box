import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message, Button, Progress } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useState, useRef, useEffect } from 'react';
import { pick } from 'lodash'
import classnames from 'classnames'
// @ts-ignore
import GifShot from 'gifshot'
import LinkList from '@/components/LinkList'
import { VIDEO_GIF_LINK_LIST  } from '@/utils/Constants/LinkList'
import Config from './components/Config'
import type { ConfigRef, ConfigType } from './components/Config'
import styles from './index.less'

const { Dragger } = Upload;

const isSupport = GifShot.isSupported()

export default () => {

  const [ loading, setLoading ] = useState<boolean>(false)
  const [ blobUrl, setBlobUrl ] = useState<string>('')
  const [ gifUrl, setGifUrl ] = useState<string>('')
  const [ progress, setProgress ] = useState<number>(0)
  const [ targetFile, setTargetFile ] = useState<RcFile>()

  const configRef = useRef<ConfigRef>(null)
  const videoRef = useRef<any>(null)

  const onRecall = async () => {
    if(loading) {
      message.info('gif生成中，请稍后重试')
      return 
    }
    setLoading(true)
    setGifUrl('')
    setProgress(0)

    let newBlobUrl: string = ''
    let prevBlobUrl: string = blobUrl
    setBlobUrl('')

    try {
      if(prevBlobUrl) URL.revokeObjectURL(prevBlobUrl)
      newBlobUrl = URL.createObjectURL(targetFile)
      setBlobUrl(newBlobUrl)
      const config = (configRef.current?.config || {}) as ConfigType
      const autoSize = config['auto-size']
      const captureAll = config['captureAll']
      const { width, height, duration } = await new Promise((resolve, reject) => {
        const video = document.createElement('video')
          video.oncanplay = function() {
            let baseConfig = {
              ...pick(config, ['width', 'height']),
              duration: video.duration
            }
            if(autoSize) {
              baseConfig = {
                ...baseConfig,
                width: video.videoWidth,
                height: video.videoHeight
              }
            }
            resolve(baseConfig)
          }
          video.onerror = reject 
          video.src = newBlobUrl 
      })

      await new Promise((resolve, reject) => {
        GifShot.createGIF({
          ...config,
          numFrames: captureAll ? Math.floor(duration * 1000 / 100) : config.captureSecond * 1000 / 100,
          gifWidth: width,
          gifHeight: height,
          video: newBlobUrl,
          saveRenderingContexts: true,
          progressCallback: (value: any) => {
            setProgress(parseInt(value * 100 as any))
          }
        }, function(obj: any) {
          if(obj.error) {
            reject(obj.error)
          }else {
            setGifUrl(obj.image)
            resolve(obj)
          }
        })
      })
    }catch(err) {
      console.error(err)
      message.info('Gif生成失败')
    }finally {
      setLoading(false)
    }
  }

  const onChange = useCallback((file: RcFile, fileList: RcFile[]) => {

    setTargetFile(file)

    return false 
  }, [blobUrl])

  useEffect(() => {
    if(targetFile) onRecall()
  }, [targetFile])

  if(!isSupport) {
    return (
      <h5>浏览器暂不支持</h5>
    )
  }

  return (
    <PageContainer
      ghost
      header={{
        title: '视频转GIF',
      }}
      className={styles['video-gif']}
    >
      <LinkList
        value={VIDEO_GIF_LINK_LIST}
      />
      <Dragger 
        name={'file'}
        multiple={false}
        beforeUpload={onChange}
        disabled={loading}
        showUploadList={false}
        // accept="image/*"
      >
        <p className={classnames(styles["video-gif-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["video-gif-text"]}>添加视频到这里</p>
      </Dragger>
      <Config
        ref={configRef}
        url={blobUrl}
        onReCall={onRecall}
      />
      <video
        src={blobUrl}
        width='100%'
        controls
        muted
        ref={videoRef}
        style={{
          display: !!blobUrl ? 'block' : 'none'
        }}
      />
      {
        loading && (
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{
              width: '100%'
            }}
            percent={progress}
          />
        )
      }
      {
        !!gifUrl && (
          <>
            <img
              width='100%'
              src={gifUrl}
            />
            <Button>

            </Button>
          </>
        )
      }
    </PageContainer>
  );
};
