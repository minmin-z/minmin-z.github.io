<template>
  <div>
    <div class="zTree ">
        <ul id="tree" class="ztree"></ul>
    </div>
    <div style="text-align:center;margin-top:30px;">

      <el-button type="primary" @click="saveFn()">保存</el-button>
      <el-button @click="close()">取消</el-button>
    </div>
  </div>
</template>
<script>
 
// 树结构的引用
import "@/plugins/ztree/js/jquery.ztree.core.min.js"
import "@/plugins/ztree/js/jquery.ztree.excheck.min.js"
import "@/plugins/ztree/css/zTreeStyle/zTreeStyle.css"

import { loadMenusTree, loadRoleMenus, saveMenu } from '@/api/system/roles'

export default {
  name:'setTree',
  props:{
    roleId:Number
  },

  data(){
    return {
      treeObj:[], //树
      //---------------树结构-------------------------
      setting:{
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
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
            onClick: function (event, treeId, treeNode) {
                
            }
        }
      },
      zNodes:[]
    }
  },
  mounted(){
    this.getMenu()
  },
  methods: {
     //获取菜单信息
    getMenu(){
      loadMenusTree().then( res => {
        console.log(res)
        this.zNodes = res.data
        this.zNodes.push({menuId:0,deptParentId:-1,menuDesc:"系统菜单(ROOT)",menuLabel:"系统菜单(ROOT)",isEnable:"1",isLeaf:"1",open:true})
        this.treeObj = $.fn.zTree.init($("#tree"), this.setting, this.zNodes);
        this.roleMenu()
      })
    },
    //角色所含权限
    roleMenu(){
      loadRoleMenus(this.roleId).then( res => {
        console.log(res)
        let menus = res.data
        if(menus && menus.length>0){
            for(var key in menus){
                let node = this.treeObj.getNodeByParam("menuId", menus[key]["menuId"], null);
                this.treeObj.checkNode(node, true, false);
            }
        }
      })
    },
    //保存
    saveFn(){
      let nodes = this.treeObj.getCheckedNodes(true);
      let menu_id_ary = [];
      for(let key in nodes){
          if(nodes[key]["menuId"] != 0){
              // 节点0是虚拟根节点,不需要保存
              menu_id_ary.push(nodes[key]["menuId"]);
          }
      } 
      let roleId = this.roleId
      let menus = menu_id_ary.join(",");
      if(menu_id_ary.length>0){
          this.saveRoleMenus(roleId, menus);
      }else{
        this.$confirm('您未选择任何有效资源,继续保存将清除该角色已关联的资源权限,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveRoleMenus(roleId, menus);
        }).catch(() => {});
      }
    },
    //
    saveRoleMenus(roleId,menus){
      saveMenu(roleId,menus).then( res => {
        console.log(res)
        this.$message({ message: '保存成功', type: 'success'});
        this.close()
      })
    },
    close(){
      this.$emit("closeFn")
    },
    
  }
}
</script>
 
<style scoped>
 .zTree{
  overflow-y: scroll;
  height: 500px;
 }
</style>