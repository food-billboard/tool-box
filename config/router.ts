
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
  // {
  //     name: ' CRUD 示例',
  //     path: '/table',
  //     component: './Table',
  // },
]