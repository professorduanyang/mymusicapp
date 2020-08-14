<template>
  <div class="login">
    <img class="headerImg" src="http://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/bannner/1904/springcloud_banner.png" />
    <cube-form :model="model" :schema="schema" @submit="submitHandler"></cube-form>
    <p class="message" v-show="error">用户名或者密码错误</p>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    computed:{
      ...mapState(['token'])
    },
    data(){
      return {
        error:false,
        model:{
          username:'',
          password:''
        },
        schema:{
         fields:[
           {
             type:'input', 
             modelKey:'username',
             label:'昵称',
             props:{
               type:'text',
               placeholder:'请输入您的昵称'
             },
             rules:{
               required:true,
               type:'string'
             },
             trigger:'blur',
             messages:{
               required:'昵称不能为空!'
             }
           },
           {
             type:'input',
             modelKey:'password',
             label:'密码',
             props:{
               placeholder:'请输入您的密码',
               type:'password',
               eye:{
                 open:false
               }
             },
             rules:{
               required:true
             },
             trigger:'blur',
             messages:{
               required:'密码不能为空!'
             }
           },
           {
            type: 'submit',
            label: '登录'
           }
         ]
       }
      }
    },
    methods:{
      submitHandler(e){
        //否则点击会刷新页面
        e.preventDefault()
        this.axios.get('/api/login',{
          params:this.model
        }).then(result => {
          const data = result.data
          if (!data.isLogin) {
            //登录失败
            this.error = true
          }else {
            //登录成功
            const token = data.token
            this.error = false
            window.localStorage.setItem('token',token)
            this.$store.commit('setToken',token)
            if (this.$route.query.redirect) {
               //重定向过来的
               this.$router.push(this.$route.query.redirect)
            }else {
               this.$router.push({path:'/recommend'})
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  .login {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 9999;
  }
  .headerImg {
    width:100%;
    height:200px;
  }
  .message {
     width:100%;
     height:20px;
     text-align:center;
     color:red;
  }
</style>