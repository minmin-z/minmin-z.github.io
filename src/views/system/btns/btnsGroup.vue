<template>
  <div>
    <div class="tips">
        <img src="@/assets/img/menu.png" alt="" class="img" style="vertical-align: middle;">
        <span class="tip">想拥有的操作按钮(请点击勾选)</span>
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
 import { saveBtnInMenu } from '@/api/system/menuList'

export default {
  name:'BtnsGroup',
  props:{
    btnList:Array,
    menuId:Number
  },
  data(){
    return {
      btns:[],
      // btnBackColor:'#dddddd'
    }
  },
  mounted(){
    //处理 按钮背景色
    this.btnList.forEach( v => {
      v.backColor = true
    })
    // this.btns = this.btnList
    this.getAllBtn()
    console.log(this.menuId)
    console.log(this.btnList)
  },
  methods: {
    //获取所有有效按钮
    getAllBtn(){
      isEnableBtn().then( res => {
            console.log(res)
            this.btns = res.data
            this.btns.forEach( v => {
              v.backColor = false
            })
      } )
    },
    //回显已经赋权的按钮
    showReadyBtn(){
      
    },
    //选择 某个按钮
    checkOn(e,item){
      item.backColor = !item.backColor
       this.$forceUpdate()  //强制刷新dom
    },
    //保存
    submitForm(){
      console.log(this.btns)
      let codes = []
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
          cancleForm()
        }
      })

    },
    cancleForm(){
      this.$emit("closeFn")
    }
  }
}
</script>
 
<style scoped>
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