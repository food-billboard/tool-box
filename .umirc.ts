import { defineConfig } from '@umijs/max';
import { merge } from 'lodash'
import router from './config/router'
import proxy from './config/proxy';

const { REACT_APP_ENV } = process.env;

const commonConfig = {
  antd: {
    // configProvider
    configProvider: {},
    // themes
    // dark: true,
    compact: true,
    // babel-plugin-import
    import: true,
    // less or css, default less
    style: 'less',
  },
  manifest: {
    basePath: '/',
  },
  history: {
    type: 'hash',
  },
  alias: {

  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '工具箱',
  },
  routes: router,
  proxy: (proxy as any)[REACT_APP_ENV || 'prod'],
  // iconFontUrl: ''
}


const developmentConfig: any = merge({}, commonConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'dev',
  },
});

const productionConfig: any = merge({}, commonConfig, {
  define: {
    'process.env.REACT_APP_ENV': 'prod',
  },
  //-----打包配置
  base: '/',
  publicPath: '/api/backend/tool-box/',
});

export default defineConfig(
  REACT_APP_ENV === 'prod' ? productionConfig : developmentConfig,
);

