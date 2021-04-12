import request from '@/utils/request'

const api = {
  goodsList: '/api/admin/v1/Goods/list',
  goodsDetail: '/api/admin/v1/Goods/detail',
  categoryList: '/api/admin/v1/Goods/category/list',
  categoryTree: '/api/admin/v1/Goods/category/tree',
  categoryDetail: '/api/admin/v1/Goods/category/detail',
  commentList: '/api/admin/v1/Goods/comment/list'
}
const baseUrl = '/api/admin/v1/Goods'
/**
 * 获取商品列表
 * @param parameter
 * @returns {*}
 */
 export function getGoodsList (parameter) {
  return request({
    url: api.goodsList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取商品列表
 * @param parameter
 * @returns {*}
 */
 export function getGoodsDetail (parameter) {
  return request({
    url: api.goodsDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取商品分类列表
 * @param parameter
 * @returns {*}
 */
 export function getCategoryList (parameter) {
  return request({
    url: api.categoryList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取所有分类树
 * @param parameter
 * @returns {*}
 */
 export function getCategoryTree (parameter) {
  return request({
    url: api.categoryTree,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取分类详情
 * @param parameter
 * @returns {*}
 */
 export function getCategoryDetail (parameter) {
  return request({
    url: api.categoryDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取商品评论列表
 * @param parameter
 * @returns {*}
 */
 export function getCommentList (parameter) {
  return request({
    url: api.commentList,
    method: 'get',
    params: parameter
  })
}

/**
 * 商品相关增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiGoods (cmd, parameter) {
  return request({
    url: `${baseUrl}/${cmd}`,
    method: 'post',
    data: parameter
  })
}
