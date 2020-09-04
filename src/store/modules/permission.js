import { asyncRoutes, constantRoutes } from '@/router'

import { getMenuList } from '@/api/system'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

//菜单的层级关系整理
 function handleMenu(data,menuParentId){
  let menuList = []
  let children
  data.forEach( (v,i) => {
    v.name = 'Form'+i
    v.path = '/form'+i
    v.hidden = false
    v.meta = {}
    v.meta.title = v.menuLabel
    if( data[i].menuParentId == menuParentId){
      let obj = data[i]
      children = handleMenu( data, obj.menuId)
      if(children.length > 0){
        obj.children = children
      }
      menuList.push(obj)
    }
  })
  
  return menuList
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      getMenuList().then( res =>{
        console.log(res)
        let { data } = res
        let list = handleMenu(data,0)
        accessedRoutes = list
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes) 
      })
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
