<template>
  <div class="container" v-if="btns && btns.length>0">
    <div >
      <el-button v-for="item in btns" :key="item.btnId" :item="item" size="mini" @click="btnEventFn(item.btnEvent)" >
        <img class="btnImg" :src="item.btnIcon" >
        <span class="btnName">{{ item.btnName }}</span>
      </el-button>
    </div>
  </div>
</template>
<script>
 
export default {
  name:'Btns',
  data(){
    return {
      btns:[]
    }
  },
  watch:{
    '$store.state.permission.btnsList':function(val){
      this.btns = val
      
    }
  },
  created(){
    this.btns = this.$store.state.permission.btnsList
  },
  methods: {
    btnEventFn(a){
      this.$emit('btnEvent',a)
      console.log(a)
    }
  }
}
</script>
 
<style scoped>
 .container {
  height: 50px;
  width: 100%;
  background: #fff;
  /* padding: 5px 10px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04); */
 }
 .btnImg{
   width: 20px;
   margin: 0px 5px;
   vertical-align: middle;
 }
 .btnName{
   vertical-align: middle;
 }
</style>