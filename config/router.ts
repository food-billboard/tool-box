
export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
    icon: 'home'
  },
  {
    name: '图片压缩',
    path: '/image-compress',
    component: './ImageCompress',
    icon: 'picture'
  },
  {
    name: '文件MD5计算',
    path: '/file-md5',
    component: './FileMD5',
    icon: 'file'
  },
  {
    name: '图片主题色',
    path: '/image-color',
    component: './ImageColor',
    icon: 'icon-color'
  },
  {
    name: '颜色格式转换',
    path: '/color-exchange',
    component: './ColorExchange',
    icon: 'bg-colors'
  },
  // {
  //     name: ' CRUD 示例',
  //     path: '/table',
  //     component: './Table',
  // },
]