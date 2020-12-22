const httpUtil = require('../../../utils/httpUtil.js');
const app = getApp()
Page({
  data: {
    max: 150,
    currentWordNumber:0,
    imgUrl:[],
    orderInfo:'',
    productInfo:'',
    orderArray:[]
  },
  onLoad:function(options){
    let that = this;
    let orderId = options.orderId || '20200602203907504525';
    let orderArray = JSON.parse(decodeURIComponent(options.orderArray));
    getApp().globalData.boo = false;
    httpUtil.getData('/minip/order/code', {orderCode:orderId},'加载中', function(res){
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      that.setData({
        orderInfo:res.data,
        orderArray
      })
    }, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  previewimgs: function(e) {
    var currentImg = e.currentTarget.dataset.img;
    console.log(currentImg);
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接 String
      urls: this.data.imgUrl // 需要预览的图片http链接列表 Array
    })
  },
  //图片上传
  uploadFile:function(e){
    let that = this;
    if(that.data.imgUrl.length >= 3){
      wx.showToast({
        title: '最多上传三张凭证',
        icon: 'none',
        duration: 1000
      });
      return;
    };
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res.tempFilePaths); // 图片的本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({ 
          url: 'https://chopshop.weein.cn/busi/minip/uploadFile/img', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            method: 'POST'
          },
          header: { 
            'INFOINSIDE': wx.getStorageSync('infoAccess'),  //如果需要token的话要传
          },
          success: function(res){
            console.log(JSON.parse(res.data))
            if(typeof res.data != Object){
              res.data = JSON.parse(res.data);
            };
            let imgUrl = that.data.imgUrl
            imgUrl.push(res.data.data)
            console.log(imgUrl,'已上传');
            that.setData({
              imgUrl
            });
          },
          fail:function(res){
            console.log(res)
          }
        })
      }
    })
  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    this.setData({
      currentWordNumber: len //当前字数  
    });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      reason: value //当前字数  
    });
  },
  submit:function(e){
    let orderArray = this.data.orderArray;
    let refundFee = [];
    for(var i in orderArray){
      refundFee.push({
        "isDealAll":orderArray[i].isDealAll,
        "productNormId":orderArray[i].productNormId,
        "orderCode":this.data.orderInfo.orderCode,
        "reason":this.data.reason,
        "voucher":(this.data.imgUrl).join(","),
        "refundFee":orderArray[i].refundFee*1*100,
      })
    }
    // [
    //   {
    //     "productNormId":"",
    //     "orderCode":""
    //   },
    //   {
    //     "productNormId":"",
    //     "orderCode":this.data.orderInfo.orderCode,
    //     "refundFee":'',
    //     "reason":this.data.reason,
    //     "voucher":(this.data.imgUrl).join(","),
    //     "refundFee"
    //   }
    //  ]
    // let params = {
    //   orderCode:this.data.orderInfo.orderCode,
    //   refundFee:'',
    //   reason:this.data.reason,
    //   voucher:(this.data.imgUrl).join(",")
    // };
    httpUtil.postData('/minip/order/batch/applyReturn', {"orderReturnList":JSON.stringify(refundFee)},'加载中', function(res){
      if(res.status != 0){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
        wx.navigateBack();
        return;
      }
      wx.showToast({
        title: '申请售后成功',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function(){
        getApp().globalData.boo = true;
        wx.navigateBack();
      },1000)
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    },1)
  }
})
