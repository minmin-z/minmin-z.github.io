<template>
  <div>
    <div class="tips">
        <img src="@/assets/img/menu.png" alt="" class="img" style="vertical-align: middle;">
        <span class="tip">想拥有的操作按钮(请点击勾选)</span>
        <span class="tip choose" style="color:#00c722;" @click="chooseAll()">选择全部</span>
        <span class="tip choose" @click="chooseNull()">取消全部</span>
    </div>
    <div class="content">
      <div v-for="item in btns" :key="item.btnCode" >
        <div class="btnCirCle" :style="{'background-color':(item.backColor?'#58b9de':'#dddddd')}" @click="checkOn($event,item)">
          <div class="btnCon">
            <div class="left">
              <img :src="item.btnIcon" alt="" class="img"><span class="span">{{ item.btnName }}</span>
            </div>
            <div class="right" :style="{'border-top':'45px solid '+ (item.backColor?'#58b9de':'#dddddd')}">
                <img src="@/assets/img/yes.png" alt="" class="yesImg">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" @click="submitForm()">保存</el-button>
      <el-button @click="cancleForm('btnForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
 import { isEnableBtn } from '@/api/system/btns'
 import { saveBtnInMenu, btnInMenu, saveBtnInRoleMenu } from '@/api/system/menuList'

export default {
  name:'BtnsGroup',
  props:{
    btnList:Array,
    menuId:Number,
    roleId:Number
  },
  data(){
    return {
      btns:[],
      // btnBackColor:'#dddddd'
    }
  },
  mounted(){
    console.log(this.roleId)
    if(this.roleId){
      this.getRoleAllBtn()
    }else{
      this.getMenuAllBtn()

    }
  },
  methods: {
    //菜单管理  ----- 获取所有有效按钮
    getMenuAllBtn(){
      isEnableBtn().then( res => {
          console.log(res)
          this.btns = res.data
          //处理 按钮背景色和选中
          this.btns.forEach( v => {
            v.backColor = false
            this.btnList.forEach( k => {
              if(v.id == k.btnId ){
                v.backColor = true
              }
            })
          })
      } )
    },
    //角色管理 ====== 获取所有有效的按钮
    getRoleAllBtn(){
      btnInMenu(this.menuId).then( res => {
        console.log(res)
        this.btns = res.data
        if(res.data.length > 0){
          //处理 按钮背景色和选中
          this.btns.forEach( v => {
            v.backColor = false
            this.btnList.forEach( k => {
              if(v.btnId == k.btnId ){
                v.backColor = true
              }
            })
          })
        }else{
          this.$confirm('该菜单下未分配任何按钮!', '温馨提示', {
              confirmButtonText: '确定',
              showCancelButton:false,
              type: 'warning'
          }).then(() => {
            this.cancleForm()
          })
        }
          
      } )
    },
    //选择 某个按钮
    checkOn(e,item){
      item.backColor = !item.backColor
       this.$forceUpdate()  //强制刷新dom
    },
    //选择全部
    chooseAll(){
      this.btns.forEach( v => {
        v.backColor = true
      })
      this.$forceUpdate()  //强制刷新dom
    },
    //取消选择全部
    chooseNull(){
      this.btns.forEach( v => {
        v.backColor = false
      })
      this.$forceUpdate()  //强制刷新dom
    },
    //保存
    submitForm(){
      console.log(this.btns)
      let codes = []
      
      if(this.roleId){  //角色下的保存
          this.btns.forEach( v => {
            if( v.backColor == true){
              codes.push(v.menuId + "-" + v.btnId)
            }
          })
          let form = {
            roleId: this.roleId,
            // menuId:this.menuId,
            menuBtnIds:codes.join(",")
          }
          saveBtnInRoleMenu(form).then( res => {
            console.log(res)
            if(res.data){
              this.$message({ message: '添加成功', type: 'success'});
              this.cancleForm()
            }
          })
      }else{  //菜单下的保存
          this.btns.forEach( v => {
            if( v.backColor == true){
              codes.push(v.id)
            }
          })
          let forms = {
            menuId:this.menuId,
            btnIds:codes.join(",")
          }
          console.log(forms)
          saveBtnInMenu(forms).then( res => {
            console.log(res)
            if(res.data){
              this.$message({ message: '添加成功', type: 'success'});
              this.cancleForm()
            }
          })
      }
      

    },
    cancleForm(){
      this.$emit("closeFn")
    }
  }
}
</script>
 
<style scoped>
.choose{
    float: right;
    color: #970fec;
    padding: 10px;
    cursor: pointer;
}
.content{
  overflow: auto;
}
.btnCirCle{
    /* background-color: #dddddd; */
    width: 150px;
    height: auto;
    padding: 5px;
    display: inline-block;
    border-radius: 5px;
    margin: 10px 5px;
    cursor: pointer;
    float: left;
}
.btnCon{
    background-color: #ffffff;
    width: 100%;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    position: relative;
    line-height: 40px;
}
.left{
  width: calc(100% - 40px);
}
.right{
    position: absolute;
    /* border-top: 45px solid #ddd; */
    border-left: 45px solid transparent;
    width: 0px;
    top: 0px;
    right: 0px;
}
.yesImg{
  position: absolute;
  top: -45px;
  right: 0px;
  width:25px;
}
 .tips{
   width: 100%;
   padding: 5px;
   background-color: beige;
   margin-bottom: 10px;
 }
 .img{
   width:25px;
   margin: 5px;
   vertical-align: middle;
 }
 .tip, .span{
   vertical-align: middle;
 }
</style>