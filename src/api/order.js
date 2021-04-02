import request from '@/utils/request'

const api = {
  OrderList: 'api/admin/v1/Orders/page',
  OrderDetail: 'api/admin/v1/Orders/detail',
  OrderDelivery: 'api/admin/v1/Orders/delivery',
  OrderCancel: 'api/admin/v1/Orders/cancel'
}

/**
 * 获取订单列表
 * @param parameter
 * @returns {*}
 */
 export function getOrderList (parameter) {
  return request({
    url: api.OrderList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取订单详情
 * @param parameter
 * @returns {*}
 */
 export function getOrderDetail (parameter) {
  return request({
    url: api.OrderDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 订单发货
 * @param parameter
 * @returns {*}
 */
 export function apiOrderDelivery (parameter) {
  return request({
    url: api.OrderDelivery,
    method: 'post',
    data: parameter
  })
}

/**
 * 订单发货
 * @param parameter
 * @returns {*}
 */
 export function apiOrderCancel (parameter) {
  return request({
    url: api.apiOrderCancel,
    method: 'post',
    data: parameter
  })
}
