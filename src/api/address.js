import request from '@/utils/request'

const api = {
  RtaddressList: 'api/admin/v1/Systems/returnaddress/list',
  RtaddressDetail: 'api/admin/v1/Systems/returnaddress/list'
}

const baseUrl = 'api/admin/v1/Systems/returnaddress'

/**
 * 获取省市区
 */
 export function getRegions (cmd, parameter) {
  return request({
    url: `api/admin/v1/Systems/${cmd}/list`,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取退货地址列表
 */
 export function getRtaddressList (parameter) {
  return request({
    url: api.RtaddressList,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取退货地址详情
 */
 export function getRtaddressDetail (parameter) {
  return request({
    url: api.RtaddressDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 地址相关增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiAddress (cmd, parameter) {
  return request({
    url: `${baseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}
