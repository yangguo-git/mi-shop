var httpUtil = require('../../../utils/httpUtil');
let that;
Page({
  //数据结构：以一组一组的数据来进行设定 
  data: {
    isDialog: false,
    isDialogShare:false,
    skuText: '无',
    selectArrText: '无',
    productNormId: '',
    productNumber: 1,
    thumbnailImgUrl: '',
    is_shoucang: 0,
    productInfo: {},
    normList: [],
    imgUrls: [],
    salePrice: '',
    indicatorDots: true,
    indicatorColor: '#fff',
    indicatorActiveColor: '#d2ab44',
    interval: 2000,
    duration: 500,
    circular: true,
    commodityAttr: [],
    attrValueList: [],
    info: [],
    videoSrc: '',
    videoImg: '', //视频封面，缓冲时会出现黑屏，加视频封面会提升用户体验，但是ios手机封面图会闪现，不知道怎么解决
    autoplay: true,
    touchX: 0, //手指按下时x的坐标
    touchY: 0, //手指按下时y的坐标
    interval: null, //计时器
    time: 0, //按下到松开的时间
    current: 0, //swiper的当前轮播图下标,
    isShare:false,
    chooseImage:'',
    isconticeShow:false,
    isHaibao:false,
    shareTitle: '心意有礼周边', // 分享标题
    shareCoverImg: '', // 分享封面图
    shareQrImg:'',
		goodTitle: '',
		goodPrice: '',
		saveCanvasImg: '',
    isBecome: false,
    isDisabled:true,
    saveSourceImg:'',
    adaption:'',
    huaxianPrice:'',
    telePhoneText:'电话:18500641006',
    isBegin:true,
    isBaoyou:false,
    fareTemplateCode:'',
    promotArr:[],
    saveIslimit:'',
    saveLimitnum:'',
    isShowbtn:1,
    btnFlag:'',
    lightStar:0,
    grayStar:0,
    commentNum:'',
    allCommonList:'',
    commentImgUrls:[]
  },
  // 事件处理函数
  play: function (val) {
    this.setData({
      videoSrc: val.currentTarget.dataset.item.video,
      autoplay: false,
      videoImg: val.currentTarget.dataset.item.img
    })
  },
  //禁止视频的手动控制进度属性，监听手指移动去滑动轮播图（手指滑动轮播图和控制视频进度事件冲突）
  //手指开始触屏
  start: function (e) {
    //获取触摸的原始点
    this.setData({
      touchX: e.touches.length > 0 ? e.touches[0].pageX : 0,
      touchY: e.touches.length > 0 ? e.touches[0].pageY : 0
    })
    let timeNew = this.data.time
    //开始记录时间
    this.data.interval = setInterval(() => timeNew++, 100)
    this.setData({
      time: timeNew
    })
  },
  //手指结束触屏
  end: function (e) {
    let touchX = e.changedTouches.length > 0 ? e.changedTouches[0].pageX : 0
    let touchY = e.changedTouches.length > 0 ? e.changedTouches[0].pageY : 0
    let tmX = touchX - this.data.touchX
    let tmY = touchY - this.data.touchY
    if (this.data.time < 10) {
      let absX = Math.abs(tmX)
      let absY = Math.abs(tmY)
      if (absX > 2 * absY) {
        //滑动swiper，视频停止播放
        this.setData({
          autoplay: true,
          videoSrc: '',
          videoImg: ''
        })
        if (tmX < 0) {//左滑
          this.setData({
            current: this.data.current == (this.data.info.length - 1) ? 0 : this.data.current + 1
          })
        } else {  //右滑
          this.setData({
            current: this.data.current > 0 ? this.data.current - 1 : this.data.info.length - 1
          })
        }
      }
    }
    clearInterval(this.data.interval)
    this.setData({
      time: 0
    })
  },
  handleStop: function () {
    this.setData({
      videoSrc: '',
      autoplay: true,
      videoImg: ''
    })
  },
  changeCurrent: function (e) {
    //手指滑动轮播图已经在视频播放的时候做了，这里只需要做轮播图自动滚动，但是不停的调用setData可能会出现一些未知的bug，可根据需求场景设置
    if (e.detail.source == 'autoplay') {
      this.setData({
        current: e.detail.current
      })
    }
  },
  cancle: function (e) {
    this.setData({
      isDialog: false,
      isShowbtn:1,
      btnFlag:''
    });
    var value = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      value.push(this.data.attrValueList[i].selectedValue);
    }
    if (i < this.data.attrValueList.length) {
      /*** */
    } else {
      var valueStr = "";
      for (var i = 0; i < value.length; i++) {
        // console.log(value[i]);
        valueStr += value[i] + ",";
      }
      //处理最后的逗号
      var lastStrs = valueStr.substring(0,valueStr.length-1);
      //选择的数量
      this.setData({
        skuText: lastStrs,
        isBegin:false
      })
    }
  },
  submit: function () {
    if (!this.data.isDialog) {
      this.setData({
        isDialog: true,
        isShowbtn:2,
        btnFlag:2
      });
      return;
    };
  },
  addshop:function(){//添加购物车
    if (!this.data.isDialog) {
      this.setData({
        isDialog: true,
        isShowbtn: 2,
        btnFlag:1
      });
      return;
    };
  },
  imgSubmit:function(){//点击主体弹框
    if (!this.data.isDialog) {
      this.setData({
        isDialog: true,
        isShowbtn: 3
      });
      return;
    };
  },
  sureClick:function(){//点击确定按钮
    let getbtnFlag = this.data.btnFlag; // 1 添加购物车按钮    2 立即购买按钮  
    var value = [],productNormId = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      // console.log(this.data.attrValueList[i]);
      value.push(this.data.attrValueList[i].selectedValue);
    };
    if (i < this.data.attrValueList.length) {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none',
        duration: 1000
      })
    } else {
      var valueStr = "";
      for (var i = 0; i < value.length; i++) {
        valueStr += value[i] + ",";
      };
      let b = 0;
      var max = this.data.attrValueList[0].productNormId.length;
      for (var i = 1; i < this.data.attrValueList.length; i++) {
        if (max < this.data.attrValueList[i].productNormId.length) {
          max = this.data.attrValueList[i].productNormId.length;
          b = i;
        } else if (max > this.data.attrValueList[i].productNormId.length) {
          b = 0;
        }
      };
      for (var j = 0; j < this.data.attrValueList[b].attrValueStatus.length; j++) {
        if (this.data.attrValueList[b].attrValueStatus[j]) {
          productNormId = this.data.attrValueList[b].productNormId[j];
          break;
        };
      };
      let lastStrs = valueStr.substring(0,valueStr.length-1);
      this.setData({
        skuText: lastStrs,
        productNumber:this.data.productNumber,
        isBegin:false
      });
      // count: 商品数量 ,
      // productId (string): 商品id ,
      // productName (string): 商品名称 ,
      // productNormId (string): 商品规格id ,
      // thumbnailImgUrl (string): 商品缩略图 ,
      let count = this.data.productNumber;
      let productId = this.data.productInfo.id;
      let productName = this.data.productInfo.productName;
      let sub = this.data.productInfo.productSubtitle;
      let productNormId = this.data.productNormId;
      let thumbnailImgUrl = '';
      let price = '';
      //划线价传递
      let marketPrice = '';
      let productType=valueStr;
      let fareTemplateCode = this.data.fareTemplateCode;
      for (var i = 0; i < this.data.normList.length; i++) {
        if (this.data.normList[i].productNorm.id == productNormId) {
          thumbnailImgUrl = this.data.normList[i].productNorm.thumbnailImgUrl;
          price = this.data.normList[i].productNorm.price;
          marketPrice = this.data.normList[i].productNorm.marketPrice;
          break;
        };
      };
      //跳转参数整合开始
      let productObj = [{
        count:count,
        sub:sub,
        thumbnailImgUrl:thumbnailImgUrl,
        productId:productId,
        marketPrice:marketPrice,
        fareTemplateCode:fareTemplateCode,
        productType:productType,
        productName:productName,
        productNormId:productNormId,
        price:price
      }]
//       console.log('productObj',productObj);
      //跳转参数整合结束
      let getbtnFlag = this.data.btnFlag; // 1 添加购物车按钮   2 立即购买按钮  
      if(getbtnFlag == 1){
        let shopParams={
          productName,
          productId,
          productNormId,
          count
        }
        httpUtil.postData('/minip/cart/add', shopParams, '', function (res) {
          if (!res.data) {
            wx.showToast({
              title: res.msg || '系统繁忙，请稍候再试',
              icon: 'none',
              duration: 1000
            });
            // wx.navigateTo({
            //   url: "/pages/logs/logs?btnshowFlag=2"
            // })
            return;
          };
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000
          });
        }, function (res) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        })
        //隐藏弹窗显示底部区域
        this.setData({
          isDialog:false,
          isShowbtn:1
        })
      }else if(getbtnFlag == 2){
        // wx.navigateTo({
        //   url: '/pages/product/submitOrder/submitOrder?count=' + count + '&sub=' + sub + '&productId=' + productId + '&marketPrice='+ marketPrice + '&fareTemplateCode=' + fareTemplateCode + '&productType=' + productType +'&productName=' + productName + '&price=' + price + '&productNormId=' + productNormId + '&thumbnailImgUrl=' + thumbnailImgUrl,
        // })
        wx.navigateTo({
          url: '/pages/product/submitOrder/submitOrder?productObj=' + encodeURIComponent(JSON.stringify(productObj))
        })
      }

    }
  },
  mainbuy:function(e){
    let getbtnFlag = e.currentTarget.dataset.id;// 4加入购物车     6立即购买
    if (!this.data.isDialog) {
      this.setData({
        isDialog: true,
        isShowbtn: 2,
        btnFlag:1
      });
      return;
    };
    var value = [],productNormId = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      // console.log(this.data.attrValueList[i]);
      value.push(this.data.attrValueList[i].selectedValue);
    };
    if (i < this.data.attrValueList.length) {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none',
        duration: 1000
      })
    } else {
      var valueStr = "";
      for (var i = 0; i < value.length; i++) {
        valueStr += value[i] + ",";
      };
      let b = 0;
      var max = this.data.attrValueList[0].productNormId.length;
      for (var i = 1; i < this.data.attrValueList.length; i++) {
        if (max < this.data.attrValueList[i].productNormId.length) {
          max = this.data.attrValueList[i].productNormId.length;
          b = i;
        } else if (max > this.data.attrValueList[i].productNormId.length) {
          b = 0;
        }
      };
      for (var j = 0; j < this.data.attrValueList[b].attrValueStatus.length; j++) {
        if (this.data.attrValueList[b].attrValueStatus[j]) {
          productNormId = this.data.attrValueList[b].productNormId[j];
          break;
        };
      };
      let lastStrs = valueStr.substring(0,valueStr.length-1);
      this.setData({
        skuText: lastStrs,
        isBegin:false
      });
      let count = this.data.productNumber;
      let productId = this.data.productInfo.id;
      let productName = this.data.productInfo.productName;
      let sub = this.data.productInfo.productSubtitle;
      let productNormId = this.data.productNormId;
      let thumbnailImgUrl = '';
      let price = '';
      //划线价传递
      let marketPrice = '';
      let productType=valueStr;
      let fareTemplateCode = this.data.fareTemplateCode;
      for (var i = 0; i < this.data.normList.length; i++) {
        if (this.data.normList[i].productNorm.id == productNormId) {
          thumbnailImgUrl = this.data.normList[i].productNorm.thumbnailImgUrl;
          price = this.data.normList[i].productNorm.price;
          marketPrice = this.data.normList[i].productNorm.marketPrice;
          break;
        };
      };
      //跳转参数整合开始
      let productObj = [{
          count:count,
          sub:sub,
          thumbnailImgUrl:thumbnailImgUrl,
          productId:productId,
          marketPrice:marketPrice,
          fareTemplateCode:fareTemplateCode,
          productType:productType,
          productName:productName,
          productNormId:productNormId,
          price:price
        }]
  //       console.log('productObj',productObj);
      //跳转参数整合结束
      if(getbtnFlag == 4){
        let shopParams={
          productName,
          productId,
          productNormId,
          count
        }
        httpUtil.postData('/minip/cart/add', shopParams, '', function (res) {
          if (!res.data) {
            wx.showToast({
              title: res.msg || '系统繁忙，请稍候再试',
              icon: 'none',
              duration: 1000
            });
            wx.navigateTo({
              url: "/pages/logs/logs?btnshowFlag=3"
            })
            return;
          };
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000
          });
        }, function (res) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        })
        //隐藏弹窗显示底部区域
        this.setData({
          isDialog:false,
          isShowbtn:1
        })
      }else if(getbtnFlag == 6){
        // wx.navigateTo({
        //   url: '/pages/product/submitOrder/submitOrder?count=' + count + '&sub=' + sub + '&productId=' + productId + '&marketPrice='+ marketPrice + '&fareTemplateCode=' + fareTemplateCode + '&productType=' + productType +'&productName=' + productName + '&price=' + price + '&productNormId=' + productNormId + '&thumbnailImgUrl=' + thumbnailImgUrl,
        // })
        wx.navigateTo({
          url: '/pages/product/submitOrder/submitOrder?productObj=' + encodeURIComponent(JSON.stringify(productObj))
        })
      }
    }

  },
  goHome:function(){
   wx.switchTab({
     url: '/pages/index/index' 
   });
  },
  goCustomer:function(){
    wx.navigateTo({
      url: '/pages/member/commonProblem/commonProblem' 
    });
  },
  goShopcar:function(){
    wx.switchTab({
      url: '/pages/shopCar/shopCar' 
    });
  },
  bindUserNameInput: function (e) {
    this.setData({
      productNumber: e.detail.value
    })
  },
  reduce: function (e) {
    let number = this.data.productNumber;
    if (number == 1) {
      return;
    };
    let productNumber = number - 1;
    this.setData({
      productNumber
    })
  },
  add: function (e) {
    let judgeFlag = this.data.saveIslimit;
    let judgeNum = this.data.saveLimitnum;
    let number = this.data.productNumber;//获取数量
    if(judgeFlag){
      if(number>=judgeNum){
        wx.showToast({
          title: '此商品限购,不能再添加了',
          icon: 'none',
          duration: 1000
        });
        return;
      }else{
        let productNumber = number * 1 + 1;
        this.setData({
          productNumber
        })
      }
    }else{
      let productNumber = number * 1 + 1;
      this.setData({
        productNumber
      })
    }
    
  },
  onLoad: function (options) {
    this.setData({
      includeGroup: this.data.commodityAttr
    });
    this.distachAttrValue(this.data.commodityAttr);
    // 只有一个属性组合的时候默认选中 
    if (this.data.commodityAttr.length == 1) {
      for (var i = 0; i < this.data.commodityAttr[0].attrValueList.length; i++) {
        this.data.attrValueList[i].selectedValue = this.data.commodityAttr[0].attrValueList[i].attrValue;
      }
      this.setData({
        attrValueList: this.data.attrValueList
      });
    }
    let that = this;
    let productId;
    if (options.scene){
       productId = options.scene;
    }else{
       productId = options.id;
    }
    //获取商品评价信息-----------------------8888  // 0全部  1 有图--------------
    let comonObj={
      pageNo:'1',
      pageSize:'10',
      productId:productId,
      type:'0'             
    }
    httpUtil.getData('/minip/commont/getMinipList2',comonObj,'', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      //评价相关设置
      let allComments = res.data;
      // console.log(allComments,'评价')
      let setFirst;
      if(allComments.list.length > 0){
        setFirst = allComments.list[0]
      }else{
        setFirst = ''
      }
      let setimgArr;
      if(setFirst.imgUrls){
        setimgArr = JSON.parse(setFirst.imgUrls)
      }else{
        setimgArr = []
      }
      //星星
      let goodStar,badStar;
      if(setFirst == ''){
         goodStar = 0;
         badStar = 5-(goodStar);
      }else{
         goodStar = setFirst.score;
         badStar = 5-(goodStar);
      }
      that.setData({
        commentNum:allComments.total,
        firstComment:setFirst,
        allCommonList:allComments.list,
        commentImgUrls:setimgArr,
        lightStar:goodStar,
        grayStar:badStar
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
    
    //获取商品评价信息--------------------------------------------
    //存储
    wx.setStorageSync('haiBaoCode',productId);
    httpUtil.getData('/minip/product/productInfo', {
      "productId": productId
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      // console.log("详情",res.data)
      //存储开始 分享时使用
      var shareData = res.data.productInfo;
      var setTitle;
      if (options.scene){
        var topTitle = shareData.productName;
        if(topTitle.length>15){
          setTitle = topTitle.substring(0,15) + "...";
        }else{
          setTitle = topTitle
        }
        wx.setNavigationBarTitle({
          title: setTitle
        })
      }
      if(shareData){
        wx.setStorageSync('haiBao',JSON.stringify(shareData));
      }
      //存储结束
      let chuXiao = shareData.promotions;//促销标签开始
      let postArrs;
      if(chuXiao){
        postArrs = JSON.parse(chuXiao);
      }else{
        postArrs = [];
      }
      //促销标签结束
      for (var i = 0; i < res.data.normList.length; i++) {
        var productNorm = res.data.normList[i].productNorm;
        var attrList = res.data.normList[i].attrList;
        for (var j = 0; j < attrList.length; j++) {
          attrList[j].productNormId = productNorm.id;
          attrList[j].attrKey = attrList[j].attrName;
        };
      };
      let kk = res.data.normList.map(function (item) {
        return {
          "attrValueList": item.attrList
        }
      });
      // console.log(kk,'kk');
      //获取轮播图开始
      let getInformatios = res.data.productInfo;
      let videoArrs = [];
      let getLunBo = JSON.parse(res.data.productInfo.coverImgUrl);
      if (getInformatios.coverVideoUrl) {//上传有视频时
        getLunBo.forEach(function (objs, inx) {
          if (inx == 0) {
            videoArrs.push({
              id: inx,
              img: objs.url,
              type: 'video',
              video: getInformatios.coverVideoUrl
            })
          } else {
            videoArrs.push({
              id: inx,
              img: objs.url,
              type: 'img',
              video: ''
            })
          }
        })
      } else {//无视频时
        getLunBo.forEach(function (objs, inx) {
            videoArrs.push({
              id: inx,
              img: objs.url,
              type: 'img',
              video: ''
            })
        })

      }
      //获取轮播图结束
      wx.getSystemInfo({
        success: function (res) {
          var rpx = res.windowWidth/375;
          that.setData({
            adaption:rpx
          })
        }
      })
      that.setData({
        info: videoArrs,
        imgUrls: JSON.parse(res.data.productInfo.coverImgUrl),
        productInfo: res.data.productInfo,
        salePrice: res.data.productInfo.salePrice,
        normList: res.data.normList,
        includeGroup: kk,
        commodityAttr: kk,
        chooseImage:res.data.productInfo.thumbnailImgUrl,
        saveSourceImg:res.data.productInfo.thumbnailImgUrl,
        fareTemplateCode:res.data.productInfo.fareTemplateCode,
        promotArr:postArrs,
        saveIslimit:res.data.productInfo.isLimit,
        saveLimitnum:res.data.productInfo.productLimit,
        productId:productId
      });
      that.distachAttrValue(that.data.commodityAttr);
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  onShow: function () {
    let getPost = this.data.postIshow;
    let btnshowFlag = this.data.btnshowFlag;
    if(getPost){
      if(btnshowFlag == 2){
        this.setData({
          isDialog: true,
          isShowbtn:2
        })
      }else if(btnshowFlag == 3){
        this.setData({
          isDialog: true,
          isShowbtn:3
        })
      }
    }
    getApp().globalData.boo = false;
  },
  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /** 
    将后台返回的数据组合成类似 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'] 
    } 
    */
    // 把数据对象的数据（视图使用），写到局部内 
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置 
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理 if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          };
          if (!this.isProductNormIdExist(commodityAttr[i].attrValueList[j].productNormId, attrValueList[attrIndex].productNormId)) {
            attrValueList[attrIndex].productNormId.push(commodityAttr[i].attrValueList[j].productNormId);
          };
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue],
            productNormId: [commodityAttr[i].attrValueList[j].productNormId],
          });
        }
      }
    }
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].productNormId.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值 
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isProductNormIdExist: function (value, valueArr) {
    // 判断是否已有id
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值 
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    /* 
    点选属性值，联动判断其他属性值是否可选 
    { 
    attrKey:'型号', 
    attrValueList:['1','2','3'], 
    selectedValue:'1', 
    attrValueStatus:[true,true,true] 
    } 
    console.log(e.currentTarget.dataset); 
    */
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index; //属性索引 
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中 
        this.disSelectValue(attrValueList, index, key, value);
      } else {
        // 选中 
        this.selectValue(attrValueList, index, key, value);

      }
    }
  },
  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    var selectArrText = this.data.selectArrText == '无' ? [] : this.data.selectArrText.split(',');
    selectArrText[index] = value;
    this.setData({
      selectArrText: selectArrText.join(',')
    });
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选 
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空 
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }

    // console.log('选中', commodityAttr, index, key, value);
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;

    // 判断属性是否可选  for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].productNormId.length; j++) {
        attrValueList[i].attrValueStatus[j] = false;
      }
    }
    for (var k = 0; k < attrValueList.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
          if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
            for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
              if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
                attrValueList[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    let productNormId = '';
    let salePrice = '';
    let selectImg='';//选中的图片
    // console.log('结果', attrValueList);
    if (includeGroup.length == 1) {
      productNormId = includeGroup[0].attrValueList[0].productNormId;
      let salePriceArray = this.data.normList.filter(function (item) {
        return item.productNorm.id == productNormId;
      });
      salePrice = salePriceArray[0].productNorm.price
      selectImg = salePriceArray[0].productNorm.thumbnailImgUrl;
      this.setData({
        salePrice,
        productNormId,
        chooseImage:selectImg
      });
    };
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) { // 第一次选中，同属性的值都可选 
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },

  /* 取消选中 */
  disSelectValue: function (attrValueList, index, key, value) {
    var selectArrText = this.data.selectArrText == '无' ? [] : this.data.selectArrText.split(',');
    selectArrText[index] = '待选择';
    this.setData({
      selectArrText: selectArrText.join(',')
    });
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';

    // 判断属性是否可选 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });
    //取消设置图片
    var getSource = this.data.saveSourceImg;
    this.setData({
      chooseImage:getSource
    });
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  },
  shareEvent:function(){//弹出分享
    this.setData({
      isDialogShare:true,
      isShare:true
    })
  },
  becomePicture:function(){
    let that = this;
    //先隐藏
    this.setData({
      isShare:false,
      isDialogShare:false,
    })
    //再显示
    this.setData({
      isHaibao:true,
      isconticeShow:true,
    })
    //调接口获取二维码开始
    let shareData = wx.getStorageSync('haiBaoCode');
    let productCode = shareData;
    let detailUrl = 'pages/product/productDetail/productDetail';
    httpUtil.getData('/minip/product/getQRCode', {
      "productId": productCode,
      "url":detailUrl
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      //设置二维码
      that.setData({
        shareQrImg:res.data
      })
      that.downloadImg();//生成海报
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
    //获取二维码结束
  },
  closeEvent:function(){
    this.setData({
      isShare:false,
      isDialogShare:false,
    })
  },
  noneEnoughPeople:function(){

  },
  closeHaiBao:function(){//关闭海报
    this.setData({
      isHaibao:false,
      isconticeShow:false,
    })
    wx.hideLoading();
  },
  downloadImg: function () {//6666
    //cavans开始
    let shareData = wx.getStorageSync('haiBao');
		if (shareData) {
			let parseShare = JSON.parse(shareData);
      // let imgArr = JSON.parse(parseShare.coverImgUrl);
      // console.log(parseShare.posterImgUrl);
			this.setData({
				goodTitle: parseShare.productName,
        goodPrice: parseShare.salePrice,
        secondTitle:parseShare.productSubtitle,
        // shareCoverImg:imgArr[0].url,
        shareCoverImg:parseShare.posterImgUrl,
        huaxianPrice:parseShare.marketPrice
			})
		}
    //canvas结束
		wx.showLoading({
			title: '生成中,请等待'
		});
    let that = this;
    var scaRpx = that.data.adaption;
		// 创建画布
		const ctx = wx.createCanvasContext('shareCanvas')
		// 白色背景
    ctx.setFillStyle('#fff')
    //设置动态数据
    var cansWidth = that.data.adaption*320;
    var cansHeight = that.data.adaption*400;
		ctx.fillRect(0, 0,cansWidth,cansHeight);
		ctx.draw()
		// 下载封面图
		wx.getImageInfo({
			src: that.data.shareCoverImg,
			success: (res2) => {
        // console.log(res2)
        //背景
        ctx.drawImage('/img/bg.png', 0, 0, 320*that.data.adaption, 420*scaRpx)
        //封面图
				ctx.drawImage(res2.path, 26*scaRpx, 97*scaRpx,268*scaRpx, 190*scaRpx)
				// 标题
				ctx.setFillStyle('#000') 
				ctx.setFontSize(17) 
        ctx.fillText(that.data.shareTitle, 106*scaRpx, 48*scaRpx);
				//商品名称
				ctx.setFillStyle('#000')
        ctx.setFontSize(13)
        // ctx.fillText(that.data.goodTitle, 16*scaRpx, 340*scaRpx)
        if(that.data.goodTitle.length > 15){
          var beforeTitle = that.data.goodTitle;
          var strTitle = beforeTitle.substring(0,15) + "...";
        }else{
          var strTitle = that.data.goodTitle;
        }
        ctx.fillText(strTitle, 16*scaRpx, 340*scaRpx)
        //简介
        ctx.setFillStyle('#000') 
        ctx.setFontSize(11)
        if(that.data.secondTitle.length>16){
          var beforeStr = that.data.secondTitle;
          var jieStr = beforeStr.substring(0,16) + "...";
        }else{
           var jieStr = that.data.secondTitle;
        }
        ctx.fillText(jieStr, 16*scaRpx, 360*scaRpx)
				//价格
				ctx.setFillStyle('red') 
				ctx.setFontSize(14) 
        ctx.fillText('¥' + (that.data.goodPrice) / 100, 16*scaRpx, 380*scaRpx)
        //直线
        ctx.beginPath();//开始一个新的路径
        ctx.moveTo(54*scaRpx, 376*scaRpx);//路径的起点
        ctx.lineTo(78.5*scaRpx, 376*scaRpx);//路径的终点
        //ctx.stroke();//对当前路径进行描边
        ctx.setStrokeStyle('#A6A6A6')
        ctx.closePath();//关闭当前路径
        //划线价
        ctx.setFillStyle('#A6A6A6') 
				ctx.setFontSize(11) 
        ctx.fillText('¥' + (that.data.huaxianPrice) / 100, 55*scaRpx, 380*scaRpx)
        //电话
        ctx.setFillStyle('#A6A6A6')
				ctx.setFontSize(11)
        ctx.fillText(that.data.telePhoneText, 16*scaRpx,397*scaRpx);
				// 下载二维码生成海拔
				wx.getImageInfo({
					src: that.data.shareQrImg,
					success: (res3) => {
						let qrImgSize = 74*scaRpx
            ctx.drawImage(res3.path, 221*that.data.adaption, 326*scaRpx, qrImgSize, qrImgSize)
						ctx.stroke()
            ctx.draw(true)
            wx.hideLoading();//隐藏
            that.setData({
              isDisabled: false
            })
            //添加延时
            setTimeout(()=>{
              wx.canvasToTempFilePath({
                canvasId: 'shareCanvas',
                success: function (res) {//存图片
                  // console.log(res)
                  that.setData({
                    saveCanvasImg: res.tempFilePath,
                    isBecome: true
                  })
                },
                fail:function(err){
                  wx.showToast({
                    icon:'none',
                    title: '生成图片失败'
                  })
                }
              }, this)

            },1000)
					}
				})
			}
		})
  },
  saveImg: function () {
    let that = this;
		let saveImg = this.data.saveCanvasImg;
		let isSave = this.data.isBecome;
		if (isSave) {
			wx.getSetting({
				success(res) {
				  if (res.authSetting['scope.writePhotosAlbum']) {
					wx.saveImageToPhotosAlbum({
					  filePath: saveImg,
					  success(res) {
						wx.showToast({
							title: '图片保存成功'
            })
            //关闭
            that.setData({
              isHaibao:false,
              isconticeShow:false,
            })
						
					  }
					})
				  } else {
					if (res.authSetting['scope.writePhotosAlbum'] == false) {
					  wx.openSetting({
						success(res) {
						  console.log(res.authSetting)
						}
					  })
					} else {
					  wx.saveImageToPhotosAlbum({
						filePath: saveImg,
						success(res) {
              wx.showToast({
                title: '图片保存成功'
              })
              //关闭
              that.setData({
                isHaibao:false,
                isconticeShow:false,
              })
              
						},
						fail:function(){
						  wx.showToast({
							title: '请打开保存相册权限后重试',
							icon:'none',
							duration:2000
						  })
						}
		  
					  })
					}
				  }
				}
			  })

		}

  },
  lookAll:function(){
    let getCode = this.data.productId;
    let infoAccess = wx.getStorageSync('infoAccess');
    if(infoAccess){
      wx.navigateTo({
        url: '/pages/commentsList/commentsList?getCode=' + getCode
      })
    }else{
      wx.navigateTo({
        url: "/pages/logs/logs"
      })
    }
  },
  pictureview: function (event) {//预览
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onReady: function () {
    

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let getId = this.data.productId;
    let shareObj = {
       title: "用联通积分就能买", 
　　　　path: '/pages/product/productDetail/productDetail?id=' + getId,        // 默认是当前页面，必须是以‘/’开头的完整路径
　　　　imageUrl:'../../../img/shareimg.png',
　　　　success: function(res){
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
　　　　　　}
　　　　},
      fail: function(){
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){//
　　　　　　　　
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){// 转发失败，其中 detail message 为详细失败信息
　　　　　　　　
　　　　　　}
　　　　}

   }

   return shareObj;

  },
  onShareTimeline:function(){
    let getInfos = this.data.productInfo;//商品信息获取
    return{
      title:getInfos.productName,
      imageUrl:getInfos.thumbnailImgUrl
    }

  }
})