<template>
  <el-container class="home_container">
    <el-header>
      <div class="left">
        <img src="../assets/heima.png" alt />
        <h3>电商管理后台</h3>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- id值，唯一的 -->
      <el-aside :width="isCollapse==true?'64px':'200px'">
        <a href="" class="toggle-button" @click.prevent="toggleCollapse">|||</a>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="blue" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <template slot="title">
              <!-- <i class="iconfont icon-users" v-if="item.id == 125"></i>
              <i class="iconfont icon-tijikongjian" v-if="item.id == 103"></i>
              <i class="iconfont icon-3702mima" v-if="item.id == 101"></i>
              <i class="iconfont icon-danju" v-if="item.id == 102"></i>
              <i class="iconfont icon-baobiao" v-if="item.id == 145"></i> -->
              <i class="iconfont" :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="toggleActivePath('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// created mounted
export default {
  name: "home",
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      //数据一定要初始化，否则就不是响应式的
      list:[],
      iconsObj:{
        125:'icon-users',
        103:'icon-tijikongjian',
        101:'icon-3702mima',
        102:'icon-danju',
        145:'icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} =  await this.$http.get('menus');
      if(res.meta.status!=200)return this.$message.error('获取列表失败');
      this.list = res.data
      console.log(this.list)
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    toggleActivePath(activePath){
      //光这样修改是不够的，因为页面一刷新，就没了
      this.activePath = activePath
      //持久存储
      window.sessionStorage.setItem('activePath',activePath)
    }
  }
};
</script>
<style scoped lang="less">
.home_container {
  height: 100%;
  .el-aside {
    background: #333744;
  }
  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    .left {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;
      img {
        margin-right: 10px;
      }
      h3 {
        font-weight: normal;
      }
    }
  }
  .el-main {
    background: #eaedf1;
  }
}
.el-menu{
  border-right:none;
}
.toggle-button{
  display: block;
  height:24px;
  line-height: 24px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  letter-spacing: 2px;
  text-decoration: none;
}
</style>
