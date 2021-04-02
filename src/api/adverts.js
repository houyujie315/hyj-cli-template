import request from '@/utils/request'

const getApi = {
  AdvertsList: 'api/admin/v1/Adverts/list',
  AdvertsDetail: 'api/admin/v1/Adverts/get',
  AdvertsPositionList: 'api/admin/v1/Adverts/position/list',
  AdvertsPositionDetail: 'api/admin/v1/Adverts/position/detail',
  AdvertsPositionDrop: 'api/admin/v1/Adverts/position/drop'
}

const advertsBaseURL = 'api/admin/v1/Adverts'

const positionBaseURL = 'api/admin/v1/Adverts/position'

/**
 * 获取广告列表
 * @param parameter
 * @returns {*}
 */
 export function getAdvertsList (parameter) {
  return request({
    url: getApi.AdvertsList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取广告详情
 * @param parameter
 * @returns {*}
 */
 export function getAdvertsDetail (parameter) {
  return request({
    url: getApi.AdvertsDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取广告位列表
 * @param parameter
 * @returns {*}
 */
 export function getAdvertsPositionList (parameter) {
  return request({
    url: getApi.AdvertsPositionList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取广告位详情
 * @param parameter
 * @returns {*}
 */
 export function getAdvertsPositionDetail (parameter) {
  return request({
    url: getApi.AdvertsPositionDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取广告位
 * @param parameter
 * @returns {*}
 */
 export function getAdvertsPositionDrop (parameter) {
  return request({
    url: getApi.AdvertsPositionDrop,
    method: 'get',
    params: parameter
  })
}

/**
 * 广告 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiAdverts (cmd, parameter) {
  const urlpath = `${advertsBaseURL}/${cmd}`
  return request({
    url: urlpath,
    method: 'post',
    data: parameter
  })
}

/**
 * 广告位 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiAdvertsPosition (cmd, parameter) {
  const urlpath = `${positionBaseURL}/${cmd}`
  return request({
    url: urlpath,
    method: 'post',
    data: parameter
  })
}
