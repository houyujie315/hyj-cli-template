import request from '@/utils/request'

const api = {
  LogisticsList: 'api/admin/v1/Logistics/page',
  LogisticsDetail: 'api/admin/v1/Logistics/detail',
  LogisticsDro: 'api/admin/v1/Logistics/list',
  FreightList: 'api/admin/v1/Logistics/template/list',
  GetLogistics: 'api/admin/v1/Logistics/get'
}

const baseUrl = 'api/admin/v1/Logistics'

/**
 * 获取物流公司列表
 * @param parameter
 * @returns {*}
 */
 export function getLogisticsList (parameter) {
  return request({
    url: api.LogisticsList,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取物流公司详情
 * @param parameter
 * @returns {*}
 */
 export function getLogisticsDetail (parameter) {
  return request({
    url: api.LogisticsDetail,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取物流公司集合
 * @param parameter
 * @returns {*}
 */
 export function getLogisticsDro (parameter) {
  return request({
    url: api.LogisticsDro,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取物流轨迹
 * @param parameter
 * @returns {*}
 */
 export function getLogistics (parameter) {
  return request({
    url: api.GetLogistics,
    method: 'get',
    params: parameter
  })
}
/**
 * 获取运费模板列表
 * @param parameter
 * @returns {*}
 */
 export function getFreightList (parameter) {
  return request({
    url: api.FreightList,
    method: 'get',
    params: parameter
  })
}
/**
 * 物流相关增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiLogistics (cmd, parameter) {
  return request({
    url: `${baseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}
