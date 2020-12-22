var httpUtil = require('../../utils/httpUtil');
Page({
  data: {
    isDialog: false,
    skuText: '无',
    productInfo:{},
    selectArrText: '无',
    productNormId: '',
    productNumber: 1,
    saveIslimit:'',
    saveLimitnum:'',
    thumbnailImgUrl: '',
    chooseImage:'',
    saveSourceImg:'',
    commodityAttr: [],
    attrValueList: [],
    categoryList: [],
    productList: [],
    viewId: 1,
    isShow:false
  },
  /*******确定按钮***** */
  addShopCard:function(e){
    let that = this;
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      console.log(this.data.attrValueList[i]);
    };
    if (i < this.data.attrValueList.length) {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none',
        duration: 1000
      })
      return
    }
    console.log(this.data.productNormId,this.data.productInfo.id,this.data.productInfo.productName,this.data.productNumber);
    let param = {
      productName:this.data.productInfo.productName,
      productId:this.data.productInfo.id,
      productNormId:this.data.productNormId,
      count:this.data.productNumber
    }
    httpUtil.postData('/minip/cart/add',param ,'加载中', function(res){
      if(res.status == 0 || res.data ){
        wx.showToast({
          title: '加入购物车成功',
          icon: 'none',
          duration: 1000
        });
        that.setData({
          isDialog: false
        });
      }else{
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        wx.navigateTo({
          url: "/pages/logs/logs"
        })
      }
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  /*******加入购物车按钮******** */
  addToCart:function(e){
      
      this.setData({
        includeGroup: []
      });
      this.distachAttrValue([]);

      let that = this;
      let productId = e.currentTarget.dataset['id'];
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
        if (!that.data.isDialog) {
          that.setData({
            isDialog: true
          });
        };
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
        that.setData({
          productNumber:1,
          skuText: '无',
          selectArrText: '无',
          productNormId: '',
          productInfo: res.data.productInfo,
          salePrice: res.data.productInfo.salePrice,
          normList: res.data.normList,
          includeGroup: kk,
          commodityAttr: kk,
          chooseImage:res.data.productInfo.thumbnailImgUrl,
          saveSourceImg:res.data.productInfo.thumbnailImgUrl,
          fareTemplateCode:res.data.productInfo.fareTemplateCode,
          saveIslimit:res.data.productInfo.isLimit,
          saveLimitnum:res.data.productInfo.productLimit
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
  /*********取消加入购物车弹窗********* */
  cancle: function (e) {
    this.setData({
      isDialog: false
    });
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
    var attrValueList = [];
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
  inputSearch: function (e) {
    wx.navigateTo({
      url: '/pages/product/productSearch/productSearch',
    })
  },
  select: function (e) {
    this.setData({
      viewId: e.currentTarget.dataset.index
    });
    this.loadProduct();
  },
  loadProduct: function (ele) {
    let that = this;
    let params = {
      "categoryId": this.data.viewId,
    }
    let tipText;
    //文字提示
    if(ele == '8'){
      tipText = '';
    }else{
      tipText = '加载中';
    }
    httpUtil.getData('/minip/product/categoryQuery', params, tipText, function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      that.setData({
        productList: res.data,
        isShow:true
      })
      //停止刷新
      // if(ele == '8'){
      //   wx.stopPullDownRefresh({
      //     success:function(){
      //       wx.showToast({
      //         title: '刷新成功',
      //         icon: 'none',
      //         duration: 1000
      //       })
      //     }
      //   });
      // }
    }, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
      wx.stopPullDownRefresh();
    });
  },
  productDetile: function (e) {
    let productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/productDetail/productDetail?id=' + productId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.loadFresh();
  },
  onShow: function () {
    this.loadFresh();
  },
  loadFresh:function(){
    let that = this;
    let firstCategoryId = getApp().globalData.firstId;
    httpUtil.getData('/minip/product/categoryList', {}, '', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      //过滤数据
      var filterArr = (res.data).filter(function(cateItems){
        return cateItems.parentId == '';
      })
      let setchoseId;
      //判断是直接打开还是跳转打开
      if(firstCategoryId){
        setchoseId = firstCategoryId;
      }else{
        setchoseId = filterArr[0].id;
      }

      that.setData({
        categoryList: filterArr,
        // viewId: filterArr[0].id,
        viewId:setchoseId
      });
      that.loadProduct();
    }, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    });
  },
  onHide: function () {
    getApp().globalData.firstId = '';
    this.setData({
      categoryList:[],
      productList:[],
      isShow:false
    })
  },
  onPullDownRefresh:function(){//下拉
    let that = this;
    httpUtil.getData('/minip/product/categoryList', {}, '', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      }
      //过滤数据
      var filterArr = (res.data).filter(function(cateItems){
        return cateItems.parentId == '';
      })
      that.setData({
        categoryList: filterArr,
        viewId: filterArr[0].id
      });
      that.loadProduct('8');//传递参数标识
    }, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let shareContent = wx.getStorageSync('shareContent');
    var sharePost,shareImg;
    if(shareContent){
      sharePost = JSON.parse(shareContent);
      shareImg = sharePost[0].imgLink;
    }
    let shareObj = {
       title: "用联通积分就能买",
　　　　path: '/pages/index/index', 
　　　　imageUrl: '../../img/shareimg.png',
　　　　success: function(res){// 转发成功回调
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
　　　　　　}
　　　　},
       fail: function(){// 转发失败的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
　　　　　　　　
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
　　　　　　　　
　　　　　　}
　　　　}

    }

    return shareObj;

  },
   onShareTimeline:function(){
        let shareObj = {
          title: "心意有礼周边"
        }
        return shareObj;
      }
})