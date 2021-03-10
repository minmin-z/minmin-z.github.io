<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="queryForm.btnName" placeholder="请输入按钮名称"></el-input>
      <el-button type="primary" @click="query"><i class="el-icon-search"></i>查询</el-button>
      <el-button type="success" @click="add"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
      <el-button type="warning"><i class="el-icon-edit"></i>修改</el-button>
      <el-button type="danger"><i class="el-icon-remove-outline"></i>删除</el-button>
    </el-row>
    <el-table :data="tableData" border fit style="width: 100%" highlight-current-row @current-change="handleCurrentChange" :height="getHeight"
      :header-cell-style="{background:'#f5f5f5'}">
      <el-table-column prop="btnCode" label="按钮编码" ></el-table-column>
      <el-table-column prop="btnName" label="按钮名称" ></el-table-column>
      <el-table-column prop="btnIcon" label="图标"></el-table-column>
      <el-table-column prop="btnEvent" label="事件"></el-table-column>
      <el-table-column prop="btnType" label="类型"></el-table-column>
      <el-table-column prop="isEnableName" label="状态"></el-table-column>

    </el-table>
<!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryForm.page" :page-sizes="[1, 2, 5, 100]"
        :page-size="queryForm.limit" layout="total, sizes, prev, pager, next, jumper":total="pagetotal"></el-pagination>
    
    <!-- 弹出层 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { btnList } from '@/api/btns'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      tableData: [],
      tableHeight:0,
      pagetotal:0,
      queryForm:{
        page:1,
        limit:20,
        btnName:""
      },
      title:"",
      dialogFormVisible:false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  computed:{
    getHeight(){
      return document.body.clientHeight - 200
    }
  },
  methods: {
    //获取按钮列表
    fetchData() {
      this.listLoading = true
      btnList(this.queryForm).then(res => {
        console.log(res)
        this.tableData = res.data
        this.pagetotal = res.count
        this.listLoading = false
      })
    },
    //查询
    query(){
      this.fetchData()
    },
    //添加
    add(){
      this.title = "添加按钮"
      this.dialogFormVisible = true
    },
    //监听行选中
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log(val)
    },
    //分页问题
    handleSizeChange(val) {
      this.queryForm.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.page = val
       this.fetchData()
    }
  }
}
</script>
<style scoped>
.el-row{
  margin-bottom: 10px;
}
.el-table thead {
  color: #909399;
  font-weight: 500;
  font-size: 15px;
}
i{
  margin-right: 4px;
}
.el-button{
  padding: 12px 15px;
}
.el-input{
  width: 150px;
  margin-right: 10px;
}
</style>
