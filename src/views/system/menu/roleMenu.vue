<template>
  <div>
    <el-row>
      <el-col  >
        <el-button class="" type="success" icon="el-icon-setting" size="small" @click="btnLimit">按钮权限</el-button>
        <el-button type="primary" plain size="small" @click="closeFn()">关闭</el-button>
        <div class="left" style="height:500px;">
            <div class="zTree ">
                <ul id="tree" class="ztree"></ul>
            </div>
        </div>
        
      </el-col>
    </el-row>

    <!-- 弹出层 -->
    <el-dialog title="按钮权限" v-if="dialogForm" :visible.sync="dialogForm" width="1000px" :close-on-click-modal="false" :destroy-on-close="true" append-to-body>
       <BtnsGroup :btnList="btnList" :menuId="menuId" :roleId='roleId' @closeFn="closeDia" />
    </el-dialog>
  </div>
</template>
<script>
 // 树结构的引用
import "@/plugins/ztree/js/jquery.ztree.core.min.js"
import "@/plugins/ztree/js/jquery.ztree.excheck.min.js"
import "@/plugins/ztree/css/zTreeStyle/zTreeStyle.css"

import { loadRoleMenus } from '@/api/system/roles'
import { btnInRoleMenu, btnInMenu } from '@/api/system/menuList'
import BtnsGroup from '../btns/btnsGroup'

export default {
  name:'RoleMenu',
  components:{ BtnsGroup },
  props:{
    roleId:Number
  },
  data(){
    return {
      treeObj:[], //树
      menuId:null,//选中的菜单id
      dialogForm:false,
      btnList:[],
      //---------------树结构-------------------------
      setting:{
        view: {
          selectedMulti: false
        },
        check: {
            enable: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "menuId",
                pIdKey: "menuParentId",
                rootPId: -1
            },
            key: {
                name: "menuLabel"
            }
        },
        edit: {
            enable: false
        },
        callback: {
            onClick:(event, treeId, treeNode) => {
                console.log(treeNode)
                
            }
        }
      },
      zNodes:[]
    }
  },
  mounted(){
    console.log(this.roleId)
    this.roleMenu()
  },
  methods: {
    //角色所含菜单权限
    roleMenu(){
      loadRoleMenus(this.roleId).then( res => {
        console.log(res.data[0])
        if(res.data[0]){
          this.zNodes = res.data
          this.zNodes.push({menuId:0,deptParentId:-1,menuDesc:"系统菜单(ROOT)",menuLabel:"系统菜单(ROOT)",isEnable:"1",isLeaf:"1",open:true})
          this.treeObj = $.fn.zTree.init($("#tree"), this.setting, this.zNodes);
        }else{
          this.$confirm('该角色下未分配任何菜单!', '温馨提示', {
              confirmButtonText: '确定',
              showCancelButton:false,
              type: 'warning'
          }).then(() => {
            this.closeFn()
          })
           
        }
        
      })
    },
    //分配按钮权限
    btnLimit(){
        let nodes = this.treeObj.getSelectedNodes();
        console.log(nodes)
        if(nodes && nodes.length==1){
          let isParent = nodes[0].isParent
          let menuId = nodes[0].menuId
          if(!isParent){
            this.menuId = menuId
            btnInRoleMenu(this.roleId,menuId).then( res => {
              console.log(res)
              this.btnList = res.data
              this.dialogForm = true
            } )
          }else{
            this.$message({message:'只能为最底层的菜单赋按钮权限',type:'warning'})
          }
        }else{
          this.$message({ message: '请选择要赋权限的菜单', type: 'warning'});
        }
    },
    closeFn(){
      this.$emit("closeFn")
    },
    closeDia(){
      this.dialogForm = false
    }
  }
}
</script>
 
<style scoped>
 .left{
    overflow-y:scroll;
}
</style>