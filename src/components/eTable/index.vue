<template>
  <div>

    <!-- 自封装的表格组件  tableList 表格数据 ,queryForm 查询条件 , getHeight 表格高度 showPage 是否显示分页(不设置默认有分页) change中写刷新列表的函数-->
    <el-table :data="tableList" border fit style="width: 100%" :height="getHeight" @row-click="rowClick" highlight-current-row
      ref="table" :header-cell-style="{background:'#f5f5f5'}">
      <!-- 插槽 -->
      <slot></slot>

    </el-table>
<!-- 分页 -->
    <el-pagination v-if='showPage' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryForm.page" :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.limit" layout="total, sizes, prev, pager, next, jumper":total="total" ></el-pagination>
  </div>
</template>
<script>
 
export default {
  name:'eTable',
  props:{
    tableList: Array,
    queryForm:Object,
    getHeight:Number,
    showPage:{
      type:Boolean,
      default:true
    },
    total:Number
  },
  data(){
    return {
      dataList:this.tableList,
      // getHeight:'600px',
      pagetotal:this.tableList.length
    }
  },
  created(){
  },
  methods: {
    rowClick(){

    },
    handleSizeChange(val) {
      this.queryForm.limit = val
      // this.fetchData()
      console.log(this.queryForm)
    },
    handleCurrentChange(val) {
      this.queryForm.page = val
      console.log(this.queryForm)
      //  this.fetchData()
      this.$emit("change")
    }
  }
}
</script>
 
<style scoped>
 
</style>