<template>
  <div :class="{'has-logo':showLogo}">
    <img src="../../../assets/msc.png" alt="" class="imgLogo">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getMenuList } from '@/api/system'

export default {
  components: { SidebarItem, Logo },
  data(){
    return {
      menuList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      console.log( this.$router)
      console.log(this.$store)
      return this.$store.getters.permission_routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    //  getMenu(){
    //   return new Promise( resolve => {
    //     getMenuList().then( res =>{
    //       let { data } = res
    //       resolve(this.handleMenu(data,0)) 
    //     })
    //   }) 
    // },
    // //菜单的层级关系整理
    // handleMenu(data,menuParentId){
    //   let menuList = []
    //   let children
    //   data.forEach( (v,i) => {
    //     v.hidden = false
    //     v.meta = {}
    //     v.meta.title = v.menuLabel
    //     if( data[i].menuParentId == menuParentId){
    //       let obj = data[i]
    //       children = this.handleMenu( data, obj.menuId)
    //       if(children.length > 0){
    //         obj.children = children
    //       }
    //       menuList.push(obj)
    //     }
    //   })
      
    //   return menuList
    // }
  }
}
</script>
<style scoped>
.imgLogo{
  width: 100%;
  padding: 3px;
}
</style>