import request from '@/utils/request'

const userApi = {
  Login: '/api/admin/v1/Admins/login',
  Logout: '/auth/logout',
  RestPassword: '/api/admin/v1/Admins/rest/password',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/api/admin/v1/Admins/info',
  UserMenu: '/api/admin/v1/Menus/navmenu'
  // UserInfo: '/api/user/info',
  // UserMenu: '/api/user/nav'
}

/**
 * login func 登录
 * parameter: {}
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * 修改登录密码
 * parameter: {}
 * @param parameter
 * @returns {*}
 */
 export function restPassword (parameter) {
  return request({
    url: userApi.RestPassword,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
