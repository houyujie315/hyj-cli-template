import request from '@/utils/request'

const api = {
  ArticlesCategoryList: '/api/admin/v1/Articles/category/list',
  ArticlesCategoryDrop: 'api/admin/v1/Articles/category/drop',
  ArticlesCategoryDetail: 'api/admin/v1/Articles/category/get',
  ArticlesList: 'api/admin/v1/Articles/list',
  ArticlesDetail: 'api/admin/v1/Articles/get'
}

const urlbaseForCategory = 'api/admin/v1/Articles/category'
const urlbaseForArticles = 'api/admin/v1/Articles'
/**
 * 获取文章分类列表
 * @param parameter
 * @returns {*}
 */
 export function getArticlesCategoryList (parameter) {
  return request({
    url: api.ArticlesCategoryList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取文章下拉框分类
 * @param parameter
 * @returns {*}
 */
 export function getArticlesCategoryDrop (parameter) {
  return request({
    url: api.ArticlesCategoryDrop,
    method: 'get',
    params: parameter
  })
}

/**
 * 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiArticlesCategory (cmd, parameter) {
  const urlpath = `${urlbaseForCategory}/${cmd}`
  return request({
    url: urlpath,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取文章分类详情
 * @param parameter
 * @returns {*}
 */
 export function getArticlesCategoryDetail (parameter) {
  return request({
    url: api.ArticlesCategoryDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取文章列表
 * @param parameter
 * @returns {*}
 */
 export function getArticlesList (parameter) {
  return request({
    url: api.ArticlesList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取文章详情
 * @param parameter
 * @returns {*}
 */
 export function getArticlesDetail (parameter) {
  return request({
    url: api.ArticlesDetail,
    method: 'get',
    params: parameter
  })
}

/**
 * 文章 增 删 改
 * @param parameter
 * @returns {*}
 */
 export function apiArticles (cmd, parameter) {
  const urlpath = `${urlbaseForArticles}/${cmd}`
  return request({
    url: urlpath,
    method: 'post',
    data: parameter
  })
}
