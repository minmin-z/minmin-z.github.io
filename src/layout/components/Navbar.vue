<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="home" v-if="showHome">
      <i class="el-icon-s-home userIcon" style="font-size: 33px;"></i>
      <router-link class='homeSpan' to="/">回到首页</router-link>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          
          <div class="userCon">
            <i class="el-icon-s-custom userIcon"></i>
            <!-- <img src="../../assets/msc.png" class="user-avatar"></img> -->
            <span class="userSpan">欢迎,{{userName}}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </img> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link> -->
          <a target="_blank" href="">
            <el-dropdown-item>变更登录密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">注销用户登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import store from '../../store'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return{
      userName:this.$store.getters.name,
      showHome:process.env.VUE_APP_showHome
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted(){
    console.log(process.env)
    //获取用户信息
    this.$store.dispatch('user/getInfo',{}).then( res => {
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
     logout() {
        this.$store.dispatch('user/logout')
        this.$store.dispatch('flag/getFlag', false)
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.userCon{
  cursor: pointer;
}
.home{
  position: absolute;
  right: 170px;
  top: 7px;
  cursor: pointer;
}
.homeSpan{
  font-size: 14px;
  font-weight: bold;
  color: #606297;
}
.userIcon{
  font-size: 29px;
  color: #4a98f9;
  margin: 4px;
  vertical-align: sub;
}
.userSpan{
  font-weight: bold;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
