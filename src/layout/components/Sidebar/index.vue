<template>
  <div :class="{'has-logo':showLogo}">
    <img v-if="hasLogo" :src="logo" alt="" class="imgLogo">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
        <sidebar-item v-for="route in routes" :key="route.menuId" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getMenuList } from '@/api/system/menuList'

export default {
  components: { SidebarItem, Logo },
  data(){
    return {
      menuList: [],
      hasLogo:process.env.VUE_APP_showLogo,
      logo:require(process.env.VUE_APP_logoSrc)
    }
  },
  mounted(){
    let router = this.$store.dispatch('permission/generateRoutes', '')
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      
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
    
  }
}
</script>
<style scoped>
.imgLogo{
  width: 100%;
  padding: 3px;
}
</style>