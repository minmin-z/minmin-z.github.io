<template>
  <div class="app-container" >
    <el-row>
      <el-col :span="6" class="left" :style="{ height: maxHeight + 'px' }">
        <el-button class="addBtn" type="success" icon="el-icon-edit" size="small" @click="addTree">添加</el-button>
        <el-button class="" type="success" icon="el-icon-setting" size="small" @click="btnLimit">按钮权限</el-button>
        <div class="zTree ">
            <ul id="tree" class="ztree"></ul>
        </div>
      </el-col>
      <el-col :span="18" class="right">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="菜单名称" prop="menuLabel">
            <el-input v-model="ruleForm.menuLabel"></el-input>
          </el-form-item>
          
          <!-- <el-form-item label="菜单类型" prop="isLeaf">
            <el-select v-model="ruleForm.isLeaf" placeholder="请选择菜单类型">
              <el-option label="" value=""></el-option>
              <el-option label="菜单" value="0"></el-option>
              <el-option label="目录" value="1"></el-option>
              <el-option label="新标签" value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="菜单类型" prop="isLeaf">
            <el-radio-group v-model="ruleForm.isLeaf">
              <el-radio :label="0" >菜单</el-radio>
              <el-radio :label="1" >目录</el-radio>
              <el-radio :label="2">新标签</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图标" prop="menuIcon">
            <el-input v-model="ruleForm.menuIcon" placeholder=""></el-input>
          </el-form-item>
          <!-- <el-form-item label="" prop="menuIconNew">
           <el-upload
              action="#"
              ref='upload'
              class="avatar-uploader"
              :file-list="fileList"
              accept=".jpg, .jpeg, .png, .JPG, .JPEG"
              list-type="picture-card"
              :http-request="upload"
              :on-change="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item> -->
          <el-form-item label="菜单路径" prop="menuAction">
            <el-input v-model="ruleForm.menuAction"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="levelId">
            <el-input v-model="ruleForm.levelId"></el-input>
          </el-form-item>
          <el-form-item label="菜单描述" prop="menuDesc">
            <el-input type="textarea" v-model="ruleForm.menuDesc"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态" prop="isEnable">
            <el-switch v-model="ruleForm.isEnable"></el-switch>
          </el-form-item>
          
          
          <el-form-item v-show="used">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
    <!-- 弹出层 -->
    <el-dialog title="按钮权限" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="1000px" :close-on-click-modal="false" :destroy-on-close="true">
       <BtnsGroup :btnList="btnList" :menuId="menuId" @closeFn="closeFn" />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
// 树结构的引用
import "@/plugins/ztree/js/jquery.ztree.core.min.js"
import "@/plugins/ztree/js/jquery.ztree.excheck.min.js"
import "@/plugins/ztree/css/zTreeStyle/zTreeStyle.css"

import { menuAll, saveMenu } from '@/api/system/menuList'
import { btnInMenu } from '@/api/system/menuList'
import BtnsGroup from '../btns/btnsGroup'

export default {

  name:'Menu',
  components:{ BtnsGroup },
  //局部刷新方法
  inject: ['reload'],
  data(){
    return {
      maxHeight:document.body.clientHeight - 120,
      fileList:[], //图片列表
      dialogImageUrl: '', //图片地址
      dialogVisible: false, //是否放大图片
      treeObj:[], //树
      file:'', //存储一下当前上传的图片
      dialogFormVisible:false,
      btnList:[],//有小按钮组
      menuId:null,//选中的菜单id
      ruleForm: {
          menuLabel: '',
          menuId:'',
          isLeaf: '',
          menuIcon:'',
          menuIconNew: '',
          menuAction: '',
          levelId:'',
          menuDesc: '',
          isEnable: true,
          menuParentId:'',//菜单的父id
          menuLevel:'', 
        },
        used:true, //是否显示保存按钮
        viewId:null,//当前点击的节点id
        rules: {
          menuLabel: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
          isLeaf: [
            { required: true, message: '请选择菜单类型', trigger: 'change' },
          ],
          levelId: [
            { required: true, message: '请输入排序', trigger: 'blur' },
          ],
        },
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
                this.viewId = treeNode.menuId
                if(treeNode["menuId"] == "0"){
                  this.used = false
                }else{
                  this.used = true
                }
                this.clickTree(treeNode)
                
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
      menuAll().then( res => {
        console.log(res)
        // this.
        this.zNodes = res.data
        this.zNodes.push({menuId:0,deptParentId:-1,menuDesc:"系统菜单(ROOT)",menuLabel:"系统菜单(ROOT)",isEnable:"1",isLeaf:"1",open:true})
        this.treeObj = $.fn.zTree.init($("#tree"), this.setting, this.zNodes);
      })
    },
    //添加按钮
    addTree(){
      if(this.treeObj){
          let nodes = this.treeObj.getSelectedNodes();
          if(nodes && nodes.length==1){
              let p_level = nodes[0]["level"] +1;
              if(p_level<=3){
                  this.resetForm('ruleForm')
                  let nodeLvl = p_level+1;
                  this.used = true
                  this.ruleForm.menuId = null
                  this.ruleForm.menuParentId = nodes[0]["menuId"]
                  this.ruleForm.menuLevel = nodeLvl
              }else{
                this.$message({ message: '最多只允许设置三级菜单', type: 'warning'});
              }
          }else{
              this.$message({ message: '请先为您要添加的菜单选择上级菜单', type: 'warning'});
          }
      }
    },
    //按钮弹窗
    btnLimit(){
      let nodes = this.treeObj.getSelectedNodes();
      console.log(nodes)
      if(nodes && nodes.length==1){
        let isParent = nodes[0].isParent
        let menuId = nodes[0].menuId
        if(!isParent){
          this.menuId = menuId
          btnInMenu(menuId).then( res => {
            console.log(res)
            this.btnList = res.data
            this.dialogFormVisible = true
          } )
        }else{
          this.$message({message:'只能为最底层的菜单赋按钮权限',type:'warning'})
        }
      }else{
         this.$message({ message: '请选择要赋权限的菜单', type: 'warning'});
      }
      
    },
    //保存
    submitForm(formName) {
      // this.ruleForm.menuId = this.viewId
      console.log(this.ruleForm )
      this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm)
            this.ruleForm.isEnable = this.ruleForm.isEnable ? 1 : 0
            let nodes = this.treeObj.getSelectedNodes();
            console.log(nodes)
            if(!nodes || nodes.length==0){
               this.$message({ message: '菜单未设置父级,不能执行此操作', type: 'warning'});
                return false;
            }
            saveMenu(this.ruleForm).then( res => {
              console.log(res)
              if(res.code === "0000"){
                  let { data } = res
                  let id = data["menuId"];
                  let node = this.treeObj.getNodeByParam("menuId",id,null);
                  if(node){
                      node = $.extend(node,data);
                      // 菜单存在,更新菜单
                      this.treeObj.updateNode(node);
                  }else{
                      // 菜单不存在,新建菜单
                      let parentNode = this.treeObj.getNodeByParam("menuId", data["menuParentId"])
                      this.treeObj.addNodes(parentNode, [data]);
                  }
                  this.$message({ message: '操作成功!', type: 'success'})
                  this.reload()
                  // this.resetForm('formName')
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    //点击树元素的赋值
      clickTree(nodes){
        nodes.isEnable = nodes.isEnable == 1 ? true : false
        Object.keys(this.ruleForm).forEach( v => {
          this.ruleForm[v] = nodes[v]
        })
        // if(nodes.menuIconNew != ''){
        //   this.fileList.push({url:nodes.menuIconNew})
        //   document.getElementsByClassName("el-upload--picture-card")[0].style.display = 'none'
        // }else{
        //   this.fileList = []
        //   document.getElementsByClassName("el-upload--picture-card")[0].style.display = ''
        // }
      },
    //清空表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
        // this.handleRemove(this.file)
      },
      // 关闭弹窗
      closeFn(){
        this.dialogFormVisible = false
      },

//--------------------base64按钮图标上传相关方法-----------------------------------------------------------------------------

    //自定义上传,需将action属性,设置为 "#"
      upload(data){
        var _this = this
        let read = new FileReader()
        let file = data.file
        read.readAsDataURL(file) // 文件读取装换为base64类型
        read.onloadend = function (e) {
          //单张上传,所以将上传 + 暂时隐藏
          document.getElementsByClassName("el-upload--picture-card")[0].style.display = 'none'
          _this.ruleForm.menuIconNew = this.result // this指向当前方法onloadend的作用域
        }
      },
      //图片改变的监听
      handleAvatarSuccess( file,fileList) {
        this.file = file;
      },
      //移除图片
      handleRemove(file, fileList) {
        console.log(file,fileList)
        //将上传 + 显示
        document.getElementsByClassName("el-upload--picture-card")[0].style.display = ''
        this.ruleForm.menuIconNew = ""
      },
      //放大图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      

  }
}
</script>
 
<style scoped>
  /* @import '@/plugins/ztree/css/zTreeStyle/zTreeStyle.css'; */
.right{
  padding: 0 20px;
}
.left{
    overflow-y:scroll;
}
  .left::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  }
  .left::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* border-radius   : 10px; */
  background-color: #9fc8f3
  }
  .left::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /* box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2); */
  background   : #ededed;
  /* border-radius: 10px; */
  }
  .addBtn{
    background-color: #409eff;
    border-color: #409eff;
  }
  .el-form{
    width: 500px;
  }
</style>