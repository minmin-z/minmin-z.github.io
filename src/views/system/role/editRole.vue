<template>
  <div>
    <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm" :rules="rules" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名" prop="roleDesc">
              <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="isEnable">
              <el-switch v-model="addForm.isEnable" active-value="1" inactive-value="0" ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
            <el-form-item label="人员" prop="">
              <el-input v-model="search" autocomplete="off" placeholder='输入员工姓名或工号查询'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="">

            <el-button type="primary" @click="query" style="margin-left:40px;"><i class="el-icon-search"></i>查询</el-button>
            <el-button type="success" @click="add"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
          </el-col>
        </el-row>
        <!-- 自封装的表格组件  tableList 表格数据 ,queryForm 查询条件 , getHeight 表格高度 showPage 是否显示分页(不设置默认有分页) change中写刷新列表的函数-->
        <ETable :tableList='tableList' :queryForm='queryForm' :getHeight="getHeight" :total="total" @change='getUser'>
          <el-table-column prop="userName" label="姓名" ></el-table-column>
          <el-table-column prop="userId" label="工号" ></el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <!-- <el-button type="warning" icon="el-icon-edit" size="mini"  @click="edit(scope.row)"></el-button> -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
            </template>
          </el-table-column>
        </ETable>

        <el-form-item style="text-align:center;margin-top:20px;">
          <el-button type="primary" @click="saveFn('addForm')">保存</el-button>
          <el-button @click="close()">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
import ETable from '@/components/eTable'
import { roleUser, isExistFn, getRole, saveRole } from '@/api/system/roles'


export default {
  name:'EditRole',
  components:{ ETable },
  props:{
    roleId:Number
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
      search:null,
      queryForm:{
        page:1,
        limit:10,
        withFlag:1,
        roleId:this.roleId
      },
      addForm:{
        roleDesc:'',
        isEnable:true,
        roleId:''
      },
      rules: {
          roleDesc: [
            { required: true,validator: isExist , trigger: 'blur' },
          ],
        },
      tableList:[],
      getHeight:500,
      total:0,
    }
  },
  created(){
    this.getUser()
    this.getRoleDetails()
  },
  methods: {
    //获取角色下的人员
    getUser(){
      roleUser(this.queryForm).then( res => {
        this.tableList = res.data
        this.total = res.count
      })
    },
    //获取角色回显信息
    getRoleDetails(){
      getRole(this.roleId).then( res => {
        let data = res.data
        console.log(data)
        this.addForm = data

      })
    },
    saveFn(formName){
      console.log(this.addForm)
      this.$refs[formName].validate((valid) => {
          if (valid) {
            saveRole(this.addForm).then( res => {
              console.log(res)
              if(res.code === "0000"){
                    this.$message({ message: '修改成功', type: 'success'});
                    this.close()
                    // this.$emit("list")
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    query(){
      this.queryForm.search = this.search
      roleUser(this.queryForm).then( res => {
        this.tableList = res.data
        this.total = res.count
      })
    },
    add(){

    },
    //关闭
    close(){
      this.$emit("closeEdit")
    },
  }
}
</script>
 
<style scoped>
 
</style>