//入口文件 entry
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

//导入axios
import axios from 'axios'
// 一个文件就是一个模块 模块有自己的作用域
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';//本地没有搭建后台环境
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


// if(process.env.NODE_ENV == 'production'){
//   axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'//线上接口
// }else{
//   axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'//本地接口
// }

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

// 可以打印出来当前是在开发环境还是在生产环境
//development
//production
// process.env可以得到当前服务器电脑所有的环境变量的信息
// 如果我们用的是webpack/vue cli，会多一个变量，名字叫NODE_ENV
// console.log(process.env.NODE_ENV)

//拦截器和导航守卫有什么区别，为什么用二次
// 导航守卫是为了防止非法登录，如果没有登录就直接访问后台首页是不可以（通过token判断有没有登录 在前端js当中使用）
// axios拦截器是为了复用代码，把每个ajax都要设置的头信息提取到拦截器当中（通过token拿数据 发向服务器）


// 配置nprogress进度条效果
//在发送ajax之前，让进度条开始工作，在ajax结束的时候，让进度条终止
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//axios请求拦截器
axios.interceptors.request.use(function(config){
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
},function(error){
  console.log(error)
})

//axios响应拦截器
axios.interceptors.response.use(function(config){
  NProgress.done();
  return config;
},function(error){
  console.log(error)
})

Vue.prototype.$http = axios

import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

import './filters.js'


//配置quill富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Main } from 'element-ui'
Vue.use(VueQuillEditor, /* { default global options } */)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


// Main.js = 开发阶段main.js 上线阶段main.js

// entry:入口 vue.config.js

// 通过vue.config.js去修改入口文件的名字
// process.env.NODE_ENV
