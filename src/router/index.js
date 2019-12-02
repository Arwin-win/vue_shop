import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = ()=>import('../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = ()=>import('../components/Home.vue')
// // import Welcome from '../components/Welcome.vue'
// const Welcome = ()=>import('../components/Welcome.vue')
// //@代表的是src目录
// import Welcome from '@/components/Welcome.vue'
// import Users from "@/components/user/Users.vue"
// import Rights from "@/components/right/Rights.vue"
// import Roles from "@/components/right/Roles.vue"
// import Categories from "@/components/product/Categories.vue"
// import Params from "@/components/product/Params.vue"
// import Goods from "@/components/product/Goods.vue"
// import GoodsAdd from "@/components/product/GoodsAdd.vue"
// import OrderList from "@/components/order/OrderList.vue"
// import Reports from "@/components/report/Reports.vue"
const Welcome = ()=>import(/* webpackChunkName: "welcome" */'@/components/Welcome.vue')
const Users = ()=>import(/* webpackChunkName: "users" */'@/components/user/Users.vue')
const Rights = ()=>import('@/components/right/Rights.vue')
const Roles = ()=>import('@/components/right/Roles.vue')
const Categories = ()=>import('@/components/product/Categories.vue')
const Params = ()=>import('@/components/product/Params.vue')
const Goods = ()=>import('@/components/product/Goods.vue')
const GoodsAdd = ()=>import('@/components/product/GoodsAdd.vue')
const OrderList = ()=>import('@/components/order/OrderList.vue')
const Reports = ()=>import('@/components/report/Reports.vue')
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/home',component:Home,redirect:'/welcome',children:[
    {path:'/welcome',component:Welcome},
    {path:'/users',component:Users},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Categories},
    {path:'/params',component:Params},
    {path:'/goods',component:Goods},
    {path:'/goods/add',component:GoodsAdd},
    {path:'/orders',component:OrderList},
    {path:'/reports',component:Reports}
  ]}
]


const router = new VueRouter({
  routes
})

//当你切换同一个路由的时候，就会报错
//本质就是改写了element内部的push方法
//对错误进行了捕获
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//a路由向b路由跳转之前会执行
// form ... to ...
//保安 导航守卫
router.beforeEach(function(to,from,next){
  // console.log(to)//要去哪
  // console.log(from)//来自哪里
  // 如果我们本来就是想去买票，直接放行
  // 如果买了票，就可以看电影，如果没有票，让我们去买票
  if(to.path == '/login')return next()
  let tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/login')
  //拦截
  next()
})

export default router


// cdn
// 10kb 第三方库

