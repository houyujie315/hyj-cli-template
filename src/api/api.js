import request from '@/utils/request'

/**
 * 获取上传图片token
 * @param parameter
 * @returns {*}
 */
 export function getToken (parameter) {
  return request({
    url: 'api/admin/v1/storage/get/token',
    method: 'post',
    data: parameter
  })
}
