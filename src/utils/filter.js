import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('setImgUrl', function (imgUrl, type, size) {
  if (imgUrl) {
    if (imgUrl.indexOf('?imageView') !== '-1' || imgUrl.indexOf('data:image') !== '-1') {
      return imgUrl
    }
    var imageView2 = '?imageView2/2/w/730/h/0/format'
    switch (size) {
      case 1: // 头像
        imageView2 = '?imageView2/1/w/100/h/100/format'
        break
      case 2: // 小头像
        imageView2 = '?imageView2/1/w/200/h/200/format'
        break
      case 3: // 小头像
        imageView2 = '?imageView2/1/w/300/h/300/format'
        break
      case 5:
        imageView2 = '?imageView2/1/w/500/h/500/format'
        break
      case 4:
        imageView2 = '?imageView2/1/w/1080/h/540/format'
        break
      case 8:
        imageView2 = '?imageView2/2/w/800/h/800/format'
        break
      case 58:
        imageView2 = '?imageView2/2/w/58/h/58/format'
        break
      case 64:
        imageView2 = '?imageView2/2/w/64/h/64/format'
        break
      case 105:
        imageView2 = '?imageView2/2/w/105/h/105/format'
        break
      case 300:
        imageView2 = '?imageView2/2/w/300/h/0/format'
        break
      case 520:
        imageView2 = '?imageView2/2/w/520/h/0/format'
        break
      default:
        imageView2 = '?imageView2/2/w/730/h/0/format'
        break
    }
    imgUrl = imgUrl + imageView2
  } else if (type === 'avatar') {
    imgUrl = 'http://image.renzhichu.top/1a7299ca608e43beb568dab54a64215b'
  } else if (type === 'goods') {
    imgUrl = 'http://img.jishuibao.net/b6847a322981490b80cce76a28f8a431'
  } else if (type === 'shop') {
    imgUrl = 'http://img.jishuibao.net/9977db1be5744ab285d332c3ec1a5614'
  } else {
    imgUrl = 'http://img.jishuibao.net/72fda1f371874bc8854f923ed0c102a9'
  }
  return imgUrl
})
