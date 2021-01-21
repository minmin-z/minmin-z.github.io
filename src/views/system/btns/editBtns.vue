<template>
<div class="border">
  <el-form :model="btnForm" :rules="rules" ref="btnForm" label-width="100px" class="demo-ruleForm" >
    <el-form-item label="按钮编码:" prop="btnCode">
      <el-input v-model="btnForm.btnCode"></el-input>
    </el-form-item>
    <el-form-item label="按钮名称:" prop="btnName">
      <el-input v-model="btnForm.btnName"></el-input>
    </el-form-item>
    <el-form-item label="按钮图标:" prop="btnIcon">
      <!-- <el-input v-model="btnForm.btnIcon"></el-input> -->
      <el-upload
        action="#"
        class="avatar-uploader"
        :file-list="fileList"
        accept=".jpg, .jpeg, .png, .JPG, .JPEG"
        list-type="picture-card"
        :http-request="upload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="按钮事件:" prop="btnEvent">
      <el-input v-model="btnForm.btnEvent"></el-input>
    </el-form-item>
    <el-form-item label="按钮类型:" prop="btnType">
      <el-select v-model="btnForm.btnType" placeholder="请选择按钮类型">
        <el-option label="类型一" value="1"></el-option>
        <el-option label="类型二" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态:" prop="isEnable">
      <el-switch v-model="btnForm.isEnable"></el-switch>
    </el-form-item>
    <el-form-item style="text-align:center;">
      <el-button type="primary" @click="submitForm('btnForm')">保存</el-button>
      <el-button @click="resetForm('btnForm')">取消</el-button>
    </el-form-item>
  </el-form>


</div>
</template>
<script>
import { saveBtn, isExistFn, getBtnInfo } from '@/api/system/btns'

export default {
  name:'EditBtn',
  props:{
    currentId:Number,
    type:String
  },
  data(){
    var isExist = (rule, val, callback) =>{
      if(val == ""){
        callback(new Error("请输入按钮编码!")) 
      }else{
        isExistFn(this.btnForm.id,val).then( res => {
          if(res.data){
            return callback(new Error('编码已存在,请更换!'));
          }else{
            callback()
          }
        })
      }
      
    }
    return {
      fileList:[], //图片列表
      dialogImageUrl: '', //图片地址
      dialogVisible: false,
      btnForm: {
        id:this.currentId,
        btnCode: '',
        btnName: '',
        btnIcon: '',
        btnEvent: '',
        btnType: '',
        isEnable:true
      },

      formLabelWidth: '120px',
      rules: {
          btnCode: [
            { required: true,validator: isExist , trigger: 'blur' },
          ],
          btnName: [
            { required: true, message: '请输入按钮名称', trigger: 'blur' }
          ],
        }

    }
  },
  created(){
    if(this.type == "edit"){
      this.getInfo()
    }
  },
  methods: {
    //回显
    getInfo(){
      getBtnInfo(this.currentId).then( res => {
        console.log(res)
        let { data } = res
        let form = {}
        data.isEnable = data.isEnable == 1 ? true : false
        //只提取想要的字段
        Object.keys(this.btnForm).forEach( v => {
          form[v] = data[v]
        })
        if(form.btnIcon !== ""){
          //需特定的格式
          this.fileList.push({name:"x",url:form.btnIcon});
          document.getElementsByClassName("el-upload--picture-card")[0].style.display = 'none'
        }
        this.btnForm = form
      })
    },
    //保存
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.btnForm)
            this.btnForm.isEnable = this.btnForm.isEnable ? 1 : 0
            saveBtn(this.btnForm).then( res => {
              console.log(res)
              if(res.code === "0000"){
                  if(res.data){
                    this.$message({ message: '添加成功', type: 'success'});
                    this.resetForm()
                    this.$emit("list")
                  }
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    //取消
    resetForm(formName) {
        if (this.$refs[formName]!==undefined) {
            this.$refs[formName].resetFields();
        }
        this.$emit("closeDig")
      },
    //自定义上传,需将action属性,设置为 "#"
    upload(data){
      var _this = this
      let read = new FileReader()
      let file = data.file
      read.readAsDataURL(file) // 文件读取装换为base64类型
      read.onloadend = function (e) {
        //单张上传,所以将上传 + 暂时隐藏
        document.getElementsByClassName("el-upload--picture-card")[0].style.display = 'none'
        _this.btnForm.btnIcon = this.result // this指向当前方法onloadend的作用域
      }
    },
    //移除图片
    handleRemove(file, fileList) {
      //将上传 + 显示
      document.getElementsByClassName("el-upload--picture-card")[0].style.display = ''
      this.btnForm.btnIcon = ""
    },
    //放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>
 
<style scoped>
 .el-input{
   width: 380px;
 }
 .el-select{
   width: 380px;
 }
 .disabled .el-upload--picture-card {
    display: none;
}
</style>