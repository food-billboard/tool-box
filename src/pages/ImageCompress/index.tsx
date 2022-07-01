import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useMemo, useState } from 'react';
// import Compressor from 'compressorjs'
import { uniqueId } from 'lodash'
import classnames from 'classnames'
import { packFileAndDownload, downloadFile as downloadFileMethod } from '@/utils'
import type { ImageCompressData } from './type'
import styles from './index.less'

const { Dragger } = Upload;

const IMAGE_COMPRESS_ID = 'IMAGE_COMPRESS_ID'

export default () => {

  const [ fileList, setFileList ] = useState<ImageCompressData[]>([])
  const [ dealLoading, setDealLoading ] = useState<boolean>(false)

  const packDisabled = useMemo(() => {
    const filterList = fileList.filter(item => !!item.compressFile)
    return filterList.length === 0 || filterList.length !== fileList.length
  }, [fileList])

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    setFileList(prev => {
      return [
        ...prev,
        {
          id: uniqueId(IMAGE_COMPRESS_ID), 
          file: file,
          originFile: file,
          compressFile: null,
          prevSize: file.size, 
          compressSize: 0 
        }
      ]
    })
    return false 
  }, [])

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
    return packFileAndDownload(fileList.map(item => item.originFile))
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
      <Dragger 
        name={'file'}
        multiple
        beforeUpload={onChange}
        disabled={dealLoading}
      >
        <p className={classnames(styles["image-compress-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["image-compress-text"]}>添加文件到这里</p>
      </Dragger>
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
        className={styles['image-compress-file-list']}
      >
        {
          fileList.map(item => {
            const { id, file, compressFile } = item 
            return (
              <div
                key={id}
                className={styles['image-compress-file-list-item']}
              >
                <div
                  className={classnames(styles['image-compress-file-list-item-name'], 'text-ellipsis')}
                >
                  {file.name}
                </div>
                <div
                  className={styles['image-compress-file-list-item-action']}
                >
                  <Button disabled={dealLoading} key='remove' onClick={removeFile.bind(null, item)} type='link' icon={<DeleteOutlined />} />
                  <Button disabled={!compressFile || dealLoading} key='download' onClick={downloadFile.bind(null, item)} type='link' icon={<DownloadOutlined />} />
                </div>
              </div>
            )
          })
        }
      </div>
    </PageContainer>
  );
};
