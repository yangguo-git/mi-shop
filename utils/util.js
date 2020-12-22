//手机号格式
const regPhone = phone => {
  var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  return reg.test(phone);
}
const formatPhone = phone => {
  if (typeof phone == 'number') {
    phone = phone.toString();
  }
  return phone.substr(0, 3) + '****' + phone.substr(7, 11);
}
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}
/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  // var urlWithArgs = url + '?'
  // for(var key in options){
  //     var value = options[key]
  //     urlWithArgs += key + '=' + value + '&'
  // }
  // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)

  return options
}

// 网络请求
function request(url, method, data, message, succ, fff) {
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message
    })
  }
  // console.log(url + '请求的参数:', data)
  let infoAccess = wx.getStorageSync('infoAccess');
  wx.request({
    url: url,
    data: data,
    header: {
      'INFOINSIDE': infoAccess || '',
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      // console.log(url + '返回的数据:', res.data)

      if (res.data.status == "20002") {
        getApp().navLog()
      } else {
        succ(res)
      }
    },
    fail: function (err) {
      if (fff) {
        fff(err)
      }
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
    }
  })
}

//时间戳转日期格式
function getTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
module.exports = {
  request: request,
  getTime,
  regPhone: regPhone,
  formatPhone: formatPhone,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}