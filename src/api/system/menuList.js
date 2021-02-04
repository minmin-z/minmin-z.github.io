import request from '@/utils/request'
//获取导航菜单
export function getMenuList(){
  return request ({
    url:'/user/menus',
    method:'get'
  })
}
//获取所有菜单,菜单管理
export function menuAll(){
  return request({
    url:'/menu/all',
    method:'get',
    
  })
}

//保存菜单信息
export function saveMenu(data){
  return request({
    url: '/menu/save',
    method: 'POST',
    data
  })
}

//获取菜单下的所有按钮
export function btnInMenu(menuId){
  return request({
    url:'/menu/enableMenuBtnFromBtn',
    method:'get',
    params:{
      menuId:menuId
    }
  })
}

//给菜单分配按钮权限
export function saveBtnInMenu(data){
  return request({
    url:'/menu/saveMenuBtn',
    method:'post',
    data
  })
}

//查看角色下的菜单按钮
export function btnInRoleMenu(roleId,menuId){
  return request({
    url:'/role/enableRoleMenuBtnFromBtn',
    method:'get',
    params:{
      roleId:roleId,
      menuId:menuId
    }
  })
}
//给角色下的菜单赋按钮权限
export function saveBtnInRoleMenu(data){
  return request({
    url:'/role/saveRoleMenuBtn',
    method:'post',
    data
  })
}

//获取当前登录人某菜单下的按钮
export function userMenuBtn(menuId){
  return request({
    url:'/user/enableUserMenuBtn',
    method:'get',
    params:{
      menuId:menuId
    }
  })
}
