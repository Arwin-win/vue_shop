<template>
  <div class="login_container">
    <!-- <div ref="ceshi">测试</div>
    <input type="text" @input="fn($event)"> -->
    <div class="login_box" ref="aa">
      <!-- 头像区域 -->
      <div class="login_avatar">
        <img src="../assets/logo.png">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  name:'login',
  data () {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //验证规则
      loginFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    // fn(e){
    //   // console.log(e.target.previousSibling.innerHTML)
    //   // document.getElementById('ceshi').innerHTML
    //   console.log(this.$refs.ceshi.innerHTML)
    // },
    reset(){
      //所有的vue组件都是通过Vue构造函数new出来的
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      //再一次做一个表单验证，如果验证失败，return结束代码，如果验证成功，收集表单数据，发送ajax
      this.$refs.loginFormRef.validate(async valid=>{
        //如果验证失败，就结束 如果成功就继续发ajax
        if(!valid)return console.log('验证失败')
        const {data:res} =  await this.$http.post('login',this.loginForm)
        if(res.meta.status != 200)return this.$message.error('用户名或密码输入有误')
        this.$message.success('验证通过')
        //token保存到sessionStorage 电影票
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style scoped lang="less">
.login_container{
  background:#2b4b6b;
  height:100%;
  .login_box{
    width:450px;
    height:300px;
    background:#fff;
    border-radius:3px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    .login_avatar{
      width:130px;
      height:130px;
      background:#eee;
      border-radius:50%;
      position:absolute;
      left:50%;
      top:0;
      transform:translate(-50%,-50%);
      padding:10px;
      box-shadow:0 0 10px #ddd;
      img{
        width:100%;
        border-radius:50%;
      }
    }
  }
}
.login_form{
  position: absolute;
  left:0;
  bottom:0;
  width:100%;
  box-sizing: border-box;
  padding:0 20px;
  .btns{
    display: flex;
    justify-content:flex-end;
  }
}
</style>
