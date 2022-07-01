import { defineConfig } from '@umijs/max';
import router from './config/router'
import proxy from './config/proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
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
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: router,
  npmClient: 'pnpm',
  proxy: (proxy as any)[REACT_APP_ENV || 'prod'],
});

