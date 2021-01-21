<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="queryForm.btnName" placeholder="请输入按钮名称"></el-input>
      <el-button type="primary" @click="query"><i class="el-icon-search"></i>查询</el-button>
      <el-button type="success" @click="add"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
    </el-row>
    <el-table :data="tableData" border fit style="width: 100%" :height="getHeight" @row-click="rowClick" highlight-current-row
      ref="btnTable" :header-cell-style="{background:'#f5f5f5'}">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="btnCode" label="按钮编码" ></el-table-column>
      <el-table-column  label="按钮名称" prop="btnName"></el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.btnIcon" />
        </template>
      </el-table-column>
      <el-table-column prop="btnEvent" label="事件"></el-table-column>
      <el-table-column prop="btnType" label="类型"></el-table-column>
      <el-table-column prop="isEnableName" label="状态"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini"  @click="edit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryForm.page" :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.limit" layout="total, sizes, prev, pager, next, jumper":total="pagetotal" ></el-pagination>
    
    <!-- 弹出层 -->
    <el-dialog :title="title" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="550px" :close-on-click-modal="false" :destroy-on-close="true">
       <EditBtn :type='type' :currentId="currentId" @closeDig="closeDig" @list="fetchData"/>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { btnList, delBtn } from '@/api/system/btns'
import EditBtn from './editBtns'

export default {
  components:{ EditBtn },
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
      type:'',  //添加还是修改
      list: null,
      listLoading: false,
      tableData: [],
      tableHeight:0,
      pagetotal:0,
      currentId:null,  //选中行的Id
      queryForm:{    //查询列表
        page:1,
        limit:20,
        btnName:""
      },
      title:"", //子页面名称
      dialogFormVisible:false,  //显示子页面
      
    }
  },
  created() {
    this.fetchData()
  },
  computed:{
    getHeight(){
      return document.body.clientHeight - 205
    }
  },
  methods: {
    //单击行勾选
    rowClick(row){
       this.$refs.btnTable.toggleRowSelection(row);
    },
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
      this.type = 'add'
    },
    //修改
    edit(row){
        this.title = "修改按钮"
        this.dialogFormVisible = true
        this.type = 'edit'
        this.currentId = row.id
    },
    //删除
    del(row){
        this.$confirm('此操作将删除此按钮信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBtn(row.id).then( res => {
            if(res.data){
              this.fetchData()
              this.$message({ type: 'success', message: '删除成功!', duration:1000 });
            }
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除', duration:1000 });          
        });
    },
    //关闭子页面
    closeDig(){
      this.dialogFormVisible = false
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
img{
  width: 30px;
  vertical-align: middle;
}
.imgSpan{
  vertical-align: middle;
}
.el-pagination{
  text-align: right;
}
</style>
