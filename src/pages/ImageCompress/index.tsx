import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useMemo, useState, useRef } from 'react';
import Compressor from 'compressorjs'
import { uniqueId } from 'lodash'
import classnames from 'classnames'
import LinkList from '@/components/LinkList'
import { packFileAndDownload, downloadFile as downloadFileMethod, TaskPool, fileSize } from '@/utils'
import { IMAGE_COMPRESS_LINK_LIST  } from '@/utils/Constants/LinkList'
import type { ImageCompressData } from './type'
import Config, { ConfigRef } from './components/Config'
import styles from './index.less'

const { Dragger } = Upload;

const IMAGE_COMPRESS_ID = 'IMAGE_COMPRESS_ID'

export default () => {

  const [ fileList, setFileList ] = useState<ImageCompressData[]>([])

  const taskPoolRef = useRef(new TaskPool(10))
  const configRef = useRef<ConfigRef>(null)

  const dealLoading = useMemo(() => {
    return fileList.some(item => item.status === 'dealing')
  }, [fileList])

  const packDisabled = useMemo(() => {
    const filterList = fileList.filter(item => !!item.compressFile)
    return filterList.length === 0 || filterList.length !== fileList.length
  }, [fileList])

  const compressFile = useCallback((file: ImageCompressData) => {
    const { originFile } = file 
    taskPoolRef.current.enqueue(async () => {
      return new Promise<any>((resolve, reject) => {
        const { quality } = configRef.current?.config || {}
        new Compressor(originFile, {
          maxWidth: 4096,
          strict: true,
          quality,
          mimeType: 'auto',
          convertSize: 1024 * 1024 * 5,
          convertTypes: [
            'image/png'
          ],
          success: (result) => {
            resolve(result)
          },
          error: () => {
            reject()
          }
        })
      })
    }, (success, result) => {
      setFileList(prev => {
        return prev.map(item => {
          if(item.id !== file.id) return item 
          return {
            ...item,
            status: success ? 'done' : 'error',
            compressFile: result,
            compressSize: result?.size ?? 0 
          }
        })
      })
    })
  }, [])

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    const newFile: ImageCompressData = {
      id: uniqueId(IMAGE_COMPRESS_ID), 
      file: file,
      originFile: file,
      compressFile: null,
      prevSize: file.size, 
      compressSize: 0,
      status: 'dealing'
    }
    setFileList(prev => {
      return [
        ...prev,
        newFile
      ]
    })

    compressFile(newFile)

    return false 
  }, [compressFile])

  // 单文件下载
  const downloadFile = useCallback((target: ImageCompressData) => {
    return downloadFileMethod(target.compressFile!)
  }, [])

  // 删除文件
  const removeFile = useCallback((target: ImageCompressData) => {
    setFileList(prev => {
      return prev.filter(item => item.id !== target.id)
    })
  }, [])

  // 打包下载
  const handlePackFile = useCallback(() => {
    return packFileAndDownload(fileList.map(item => item.compressFile!))
    .catch(err => {
      message.info('文件下载错误，请重试！')
      console.error(err)
    })
  }, [fileList])

  return (
    <PageContainer
      ghost
      header={{
        title: '图片压缩',
      }}
      className={styles['image-compress']}
    >
      <LinkList
        value={IMAGE_COMPRESS_LINK_LIST}
      />
      <Dragger 
        name={'file'}
        multiple
        beforeUpload={onChange}
        disabled={dealLoading}
        showUploadList={false}
        accept="image/*"
      >
        <p className={classnames(styles["image-compress-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["image-compress-text"]}>添加文件到这里</p>
      </Dragger>
      <Config
        ref={configRef}
      />
      <Button
        disabled={packDisabled || dealLoading}
        type='primary'
        onClick={handlePackFile}
        icon={<DownloadOutlined />}
        className='m-tb-8'
      >
        打包下载
      </Button>
      <div
        className={(styles['image-compress-file-list'])}
      >
        {
          fileList.map(item => {
            const { id, file, status, originFile, compressSize } = item 
            return (
              <div
                key={id}
                className={classnames(styles['image-compress-file-list-item'], {
                  [styles['image-compress-file-list-item-success']]: status === 'done',
                  [styles['image-compress-file-list-item-error']]: status === 'error'
                })}
              >
                <div
                  className={classnames(styles['image-compress-file-list-item-name'], 'text-ellipsis')}
                >
                  {file.name}
                </div>
                <div
                  className={styles['image-compress-file-list-item-size']}
                >
                  {
                    status === 'done' && (
                      `${fileSize(originFile.size)} --> ${fileSize(compressSize)}`
                    )
                  }
                </div>
                <div
                  className={styles['image-compress-file-list-item-action']}
                >
                  <Button disabled={dealLoading} key='remove' onClick={removeFile.bind(null, item)} type='link' icon={<DeleteOutlined />} />
                  <Button disabled={status !== 'done' || dealLoading} key='download' onClick={downloadFile.bind(null, item)} type='link' icon={<DownloadOutlined />} />
                </div>
              </div>
            )
          })
        }
      </div>
    </PageContainer>
  );
};
