
import request from '@/utils/request'


//获取按钮列表
export function btnList(data){
  return request({
    url:'/btn/list',
    method: 'get',
    params:data
  })
}

//获取所有有效的按钮列表
export function isEnableBtn(){
  return request({
    url:'/btn/enable',
    method: 'get'
  })
}
//保存按钮
export function saveBtn(data){
  return request({
    url: '/btn/saveOrUpdate',
    method: 'POST',
    data
  })
}

//编码唯一
export function isExistFn(id,btnCode) {
  return request({
    url:'/btn/isExist',
    method:'GET',
    params:{
      id: id,
      btnCode:btnCode
    }
  })
}

//回显
export function getBtnInfo(id){
  return request({
    url:'/btn/get',
    method:'GET',
    params:{
      id
    }
  })
}

//删除
export function delBtn(id){
  return request({
    url:'/btn/del',
    method:'GET',
    params:{
      id
    }
  })
}