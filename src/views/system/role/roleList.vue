<template>
  <div class="app-container">
    <Btns @btnEvent='btnEventFn'/>

    <el-row>
      <!-- <el-input v-model="queryForm.btnName" placeholder="请输入按钮名称"></el-input> -->
      <!-- <el-button type="primary" @click="query"><i class="el-icon-search"></i>查询</el-button> -->
      <el-button type="success" @click="add"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
      
    </el-row>
    <el-table :data="roleList" border fit style="width: 100%" :height="getHeight" @row-click="rowClick" highlight-current-row
      ref="roleTable" :header-cell-style="{background:'#f5f5f5'}">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="roleDesc" label="角色"  width="300"></el-table-column>
      <el-table-column  label="状态" prop="isEnableName"  width="120"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button title="修改" type="warning" icon="el-icon-edit" size="mini"  @click="edit(scope.row)"></el-button>
          <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
          <el-button title="设置菜单权限" class="lockBtn"  icon="el-icon-lock" size="mini" @click="setFn(scope.row)"></el-button>
          <el-button title="按钮权限" class="" type="primary" icon="el-icon-setting" size="mini" @click="showRoleMenuFn(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryForm.page" :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.limit" layout="total, sizes, prev, pager, next, jumper":total="pagetotal" ></el-pagination>
<!-- 添加 -->
    <el-dialog title="添加角色" v-if="addShow" :visible.sync="addShow" width="550px" :close-on-click-modal="false" :destroy-on-close="true">
       <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm" :rules="rules">
          <el-form-item label="角色名" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isEnable">
            <el-switch v-model="addForm.isEnable"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFn('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改角色" v-if="editShow" :visible.sync="editShow" width="800px" :close-on-click-modal="false" :destroy-on-close="true" top="5vh">
       <EditRole :roleId="roleId"  @closeEdit='closeEdit' />
    </el-dialog>
    <!-- 设置权限 -->
    <el-dialog title="设置权限" v-if="setMenuShow" :visible.sync="setMenuShow" width="400px" :close-on-click-modal="false" :destroy-on-close="true" top="5vh">
       <SetTree :roleId="roleId" @closeFn='closeFn'/>
    </el-dialog>
    <!-- 角色菜单 -->
    <el-dialog title="按钮权限" v-if="showRoleMenu" :visible.sync="showRoleMenu" width="400px" :close-on-click-modal="false" :destroy-on-close="true">
       <RoleMenu :roleId="roleId" @closeFn="closeRoleMenu" />
      
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, isExistFn, saveRole, delRole } from '@/api/system/roles'
import EditRole from './editRole'
import SetTree from './roleTree'
import RoleMenu from '../menu/roleMenu'

import  Btns  from '@/components/btnsGroup'

export default {
  name:'',
  components:{ EditRole, SetTree, RoleMenu, Btns },
  computed:{
    getHeight(){
      return document.body.clientHeight - 205
    }
  },
  data(){
    var isExist = (rule, val, callback) =>{
      if(val == ""){
        callback(new Error("请输入角色名!")) 
      }else{
        isExistFn(this.addForm.roleId,val).then( res => {
          if(res.data){
            return callback(new Error('角色已存在,请更换!'));
          }else{
            callback()
          }
        })
      }
      
    }
    return {
      roleList: [],
      queryForm:{    //查询列表
        page:1,
        limit:10
      },
      pagetotal:0,
      listLoading: false,
      addShow:false,
      editShow:false,
      setMenuShow:false,
      showRoleMenu:false,
      addForm:{
        roleDesc:'',
        isEnable:true,
        roleId:''
      },
      roleId:null,
      rules: {
          roleDesc: [
            { required: true,validator: isExist , trigger: 'blur' },
          ],
        }
    }
  },
  mounted(){
    this.getRole()
  },
  methods: {
    btnEventFn(e){
      this[e]()
    },
    //按钮权限
    showRoleMenuFn(row){
      this.roleId = row.roleId
        this.showRoleMenu = true
    },
    //获取角色信息
    getRole(){
      this.listLoading = true
      getRoleList( this.queryForm ).then( res => {
        console.log(res)
        this.roleList = res.data
        this.pagetotal = res.count
        this.listLoading = false
        
      })
    },
    //添加角色
    add(){
      this.addShow = true
    },
    addFn(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.addForm)
            this.addForm.isEnable = this.addForm.isEnable ? 1 : 0
            saveRole(this.addForm).then( res => {
              console.log(res)
              if(res.code === "0000"){
                    this.$message({ message: '添加成功', type: 'success'});
                    this.resetForm()
                    this.getRole()
                    // this.$emit("list")
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //修改
    edit(row){
      this.editShow = true
      this.roleId = row.roleId
      console.log(row)
    },
    //删除
    del(row){
      console.log(row)
      this.$confirm('此操作将删除[ '+ row.roleDesc +' ], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRole(row.roleId).then( res => {
              this.getRole()
              this.$message({ type: 'success', message: '删除成功!', duration:1000 });
          })
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除', duration:1000 
          });
        });
    },
    //设置权限
    setFn(row){
      this.setMenuShow = true
      this.roleId = row.roleId
    },
    //单击行勾选
    rowClick(row){
      console.log(row)
       this.$refs.roleTable.toggleRowSelection(row);
    },
    //关闭修改弹窗
    closeEdit(){
      this.editShow = false
    },
    //关闭设置权限弹窗
    closeFn(){
      this.setMenuShow = false
    },
    //关闭按钮权限
    closeRoleMenu(){
      this.showRoleMenu = false
    },
    //取消
    resetForm(formName) {
        if (this.$refs[formName]!==undefined) {
            this.$refs[formName].resetFields();
        }
        this.addShow = false
        // this.$emit("closeDig")
      },
    //分页问题
    handleSizeChange(val) {
      this.queryForm.limit = val
      this.getRole()
    },
    handleCurrentChange(val) {
      this.queryForm.page = val
       this.getRole()
    }
  }
}
</script>
 
<style scoped>
.el-row{
  margin-bottom: 10px;
}
.lockBtn{
  background-color: #6c70f5;
  border-color: #6c70f5;
  color: #fff;
}
.lockBtn:hover{
  background-color:#7f82f7;
  border-color:#7f82f7;
  
}
</style>