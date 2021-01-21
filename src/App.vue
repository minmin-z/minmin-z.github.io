<template>
  <div id="app">
    <router-view v-if="isReload" />
  </div>
</template>

<script>
export default {
  name: 'App',
  //将方法导出
  provide(){
    return{
      reload: this.reload
    }
  },
  data(){
    return {
      isReload: true
    }
  },
  methods:{
    //实现页面局部刷新的方法
    reload(){
      this.isReload = false
      this.$nextTick(function(){
        this.isReload = true
      })
    }
  }
}
</script>
