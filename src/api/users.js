import request from '@/utils/request'

const api = {
  UsersList: 'api/admin/v1/Users/get',
  UsersInfo: 'api/admin/v1/Users/info',
  UsersDisable: 'api/admin/v1/Users/disable'
}

/**
 * 获取用户列表
 * @param parameter
 * @returns {*}
 */
 export function getUsersList (parameter) {
  return request({
    url: api.UsersList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取用户信息
 * @param parameter
 * @returns {*}
 */
 export function getUsersInfo (parameter) {
  return request({
    url: api.UsersInfo,
    method: 'get',
    params: parameter
  })
}

/**
 * 是否封禁用户
 * @param parameter
 * @returns {*}
 */
 export function postUsersDisable (parameter) {
  return request({
    url: api.UsersDisable,
    method: 'post',
    data: parameter
  })
}
