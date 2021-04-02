import request from '@/utils/request'

const api = {
  MenusList: 'api/admin/v1/Menus/list',
  MenusDetail: 'api/admin/v1/Menus/detail',
  MenusActionList: 'api/admin/v1/Menus/action/list',
  MenusActionAllList: 'api/admin/v1/Menus/action/all/list',
  PermitsList: 'api/admin/v1/Permits/list',
  PermitsChoiceList: 'api/admin/v1/Permits/choice/list',
  PermitsDetail: 'api/admin/v1/Permits/detail',
  RolesList: 'api/admin/v1/Roles/list',
  RolesDetail: 'api/admin/v1/Roles/detail',
  RolesDrop: 'api/admin/v1/Roles/drop',
  UserList: 'api/admin/v1/Admins/list',
  UserInfo: 'api/admin/v1/Admins/info'
}

const baseUrl = 'api/admin/v1/Menus'

const permitsBaseUrl = 'api/admin/v1/Permits'

const rolesBaseUrl = 'api/admin/v1/Roles'

const userBaseUrl = 'api/admin/v1/Admins'

/**
 * 获取菜单列表
 * @param parameter
 * @returns {*}
 */
 export function getMenusList (parameter) {
  return request({
    url: api.MenusList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取菜单详情
 * @param parameter
 * @returns {*}
 */
 export function getMenusDetail (parameter) {
  return request({
    url: api.MenusDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取权限action列表
 * @param parameter
 * @returns {*}
 */
 export function getMenusActionList (parameter) {
  return request({
    url: api.MenusActionList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取权限action列表
 * @param parameter
 * @returns {*}
 */
 export function getMenusActionAllList (parameter) {
  return request({
    url: api.MenusActionAllList,
    method: 'get',
    params: parameter
  })
}

/**
 * 菜单、action 增 删 改
 * @param parameter
 * @returns {*}
 */
export function apiManagerMenus (cmd, parameter) {
  return request({
    url: `${baseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取操作权限列表
 * @param parameter
 * @returns {*}
 */
 export function getPermitsList (parameter) {
  return request({
    url: api.PermitsList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取选取权限列表
 * @param parameter
 * @returns {*}
 */
 export function getPermitsChoiceList (parameter) {
  return request({
    url: api.PermitsChoiceList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取权限详情
 * @param parameter
 * @returns {*}
 */
 export function getPermitsDetail (parameter) {
  return request({
    url: api.PermitsDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 权限 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiPermits (cmd, parameter) {
  return request({
    url: `${permitsBaseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取角色列表
 * @param parameter
 * @returns {*}
 */
 export function getRolesList (parameter) {
  return request({
    url: api.RolesList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取角色详情
 * @param parameter
 * @returns {*}
 */
 export function getRolesDetail (parameter) {
  return request({
    url: api.RolesDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取角色下拉框
 * @param parameter
 * @returns {*}
 */
 export function getRolesDrop (parameter) {
  return request({
    url: api.RolesDrop,
    method: 'get',
    params: parameter
  })
}

/**
 * 角色 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiRoles (cmd, parameter) {
  return request({
    url: `${rolesBaseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取管理员列表
 * @param parameter
 * @returns {*}
 */
 export function getUserList (parameter) {
  return request({
    url: api.UserList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取用户信息
 * @param parameter
 * @returns {*}
 */
 export function getUserInfo (parameter) {
  return request({
    url: api.UserInfo,
    method: 'get',
    params: parameter
  })
}

/**
 * 管理员 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiUsers (cmd, parameter) {
  return request({
    url: `${userBaseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}
