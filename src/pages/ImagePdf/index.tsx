import { PageContainer } from '@ant-design/pro-layout';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface'
import { useCallback, useState, useRef } from 'react';
import classnames from 'classnames'
import { jsPDF } from 'jspdf'
import LinkList from '@/components/LinkList'
import { IMAGE_PDF_LINk_LIST  } from '@/utils/Constants/LinkList'
import Config from './components/Config'
import type { ConfigRef } from './components/Config'
import styles from './index.less'

const { Dragger } = Upload;

const ImagePdf = () => {

  const [ loading, setLoading ] = useState<boolean>(false)

  const configRef = useRef<ConfigRef>(null)

  const getImageData = useCallback(async (files: RcFile[]) => {
    
    let fileData: {
      width: number 
      height: number 
      mime: string 
      file: RcFile
    }[] = []
    for(let i = 0; i < files.length; i ++) {
      const file = files[i]
      const image = new Image() 
      let url: string = ''
      await new Promise<void>((resolve, reject) => {
        image.onload = () => {
          fileData.push({
            width: image.width,
            height: image.height,
            mime: file.type,
            file
          })
          URL.revokeObjectURL(url)
          resolve()
        }
        image.onerror = (err) => {
          URL.revokeObjectURL(url)
          reject(err)
        }
      })
      url = URL.createObjectURL(file)
      image.src = url 
    }

    return fileData

  }, [])

  const onChange = useCallback(async (file: RcFile, fileList: RcFile[]) => {
    setLoading(true)

    const { orientation, compressPdf } = configRef.current?.config || {}

    try {
      const pdf = new jsPDF(orientation, 'pt', 'a4', compressPdf)
      const imageData = await getImageData(fileList)

      imageData.forEach((image, index) => {

        const { width, height, file, mime } = image 
        const pageHeight = width / 595.28 * 841.89
        let leftHeight = height 
        const imageWidth = 595.28 
        const imageHeight = 595.28 / width * height

        if(leftHeight < pageHeight) {
          pdf.addImage('', mime, 0, 0, imageWidth, imageHeight)
        }else {
          let position = 0 
          while(leftHeight > 0) {
            pdf.addImage('', mime, 0, position, imageWidth, imageHeight)
            leftHeight -= pageHeight
            position -= 841.89
				    //避免添加空白页
				    if (leftHeight > 0) {
				        pdf.addPage()
				    }
          }
          
        }


      })

      pdf.save(`pdf-document-${Date.now()}.pdf`)

    }catch {

    }

    setLoading(false)

    return false 
  }, [getImageData])

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