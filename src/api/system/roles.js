import request from '@/utils/request'
//获取角色
export function getRoleList(data){
  return request ({
    url:'/role/list',
    method:'get',
    params: data 
  })
}

//编码唯一
export function isExistFn(id,roleName) {
  return request({
    url:'/role/isExist',
    method:'GET',
    params:{
      roleId: id,
      roleDesc:roleName
    }
  })
}

//添加角色信息
//保存按钮
export function saveRole(data){
  return request({
    url: '/role/saveOrUpdate',
    method: 'get',
    params: data
  })
}

//删除
export function delRole(roleId){
  return request({
    url: '/role/del',
    method: 'get',
    params: {
      roleId:roleId
    }
  })
}

//角色所含人员列表
export function roleUser(data){
  return request({
    url: '/role/user/list',
    method: 'get',
    params: data
  })
}

//回显角色信息
export function getRole(id){
  return request({
    url: '/role/get',
    method: 'get',
    params: {
      id:id
    }
  })
}

//角色  初始化树结构
export function loadMenusTree(){
  return request({
    url: '/menu/all/enable',
    method: 'get'
  })
}

//角色 的权限菜单
export function loadRoleMenus(id){
  return request({
    url: '/role/menus',
    method: 'get',
    params: {
      roleId:id
    }
  })
}
//保存角色
export function saveMenu(roleId,menus){
  return request({
    url: '/role/menus/upd',
    method: 'get',
    params: {
      roleId:roleId,
      menus:menus
    }
  })
}
