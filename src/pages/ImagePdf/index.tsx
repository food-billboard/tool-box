import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useState, useRef } from 'react';
import classnames from 'classnames'
import JSPdf from 'jspdf'
import LinkList from '@/components/LinkList'
import { IMAGE_PDF_LINk_LIST  } from '@/utils/Constants/LinkList'
import Config from './components/Config'
import type { ConfigRef } from './components/Config'
import styles from './index.less'

const { Dragger } = Upload;

const ImagePdf = () => {

  const [ loading, setLoading ] = useState<boolean>(false)

  const configRef = useRef<ConfigRef>(null)

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    setLoading(true)

    try {
      const pdf = new JSPdf()
    }catch {

    }

    setLoading(false)

    return false 
  }, [])

  return (
    <PageContainer
      ghost
      header={{
        title: '图片转pdf',
      }}
      className={styles['image-pdf']}
    >
      <LinkList
        value={IMAGE_PDF_LINk_LIST}
      />
      <Dragger 
        name={'file'}
        multiple
        beforeUpload={onChange}
        disabled={loading}
        showUploadList={false}
        accept="image/*"
      >
        <p className={classnames(styles["image-pdf-drag-icon"], 'p-cor')}>
          <InboxOutlined />
        </p>
        <p className={styles["image-color-text"]}>添加图片到这里</p>
      </Dragger>
      <Config
        ref={configRef}
      />

    </PageContainer>
  );
};

export default ImagePdf