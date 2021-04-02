import request from '@/utils/request'

const api = {
  goosList: '/api/admin/v1/Goods/list',
  categoryList: '/api/admin/v1/Goods/category/list',
  categoryTree: '/api/admin/v1/Goods/category/tree',
  categoryDetail: '/api/admin/v1/Goods/category/detail'
}

/**
 * 获取商品列表
 * @param parameter
 * @returns {*}
 */
 export function getGoodsList (parameter) {
  return request({
    url: api.goosList,
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
