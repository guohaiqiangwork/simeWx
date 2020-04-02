const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    serviceArray: [{
      value: '1',
      text: '退货'
    }, {
      value: '2',
      text: '换货'
    }, {
      value: '3',
      text: '仅退款'
    }, {
      value: '4',
      text: '补发货'
    }],
    reasonArray: [{
      value: 'ywj',
      text: '未收到货'
    }, {
      value: 'aaa',
      text: '商品包装破损'
    }, {
      value: 'lj',
      text: '商品质量问题'
    }],
    orderList: [],
    upimgPathUrl1: '/image/upImg.png',
    upimgPathUrl2: '/image/upImg.png',
    upimgPathUrl3: '/image/upImg.png',
    arr: [], //单选数组
    priceArr: [], //价格数组

    applyServer: '', //申请服务类型	
    orderId: '', //订单id
    retReason: '', //退款原因
    userRemark: '', //用户备注
    tuiFalg: false,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.falg == 'tui') {
      this.setData({
        tuiFalg: true,
        retReason: this.data.reasonArray[0].text,
        applyServer: this.data.serviceArray[2].value,
        index: 2,
        index1: 0,
        servelNull: '0',
        reasonNull: '0'
      })
    }
    this.setData({
      orderId: options.orderId
    });
    this.getReturnList(options.orderId); //获取页面数据
  },
  // 照片上传
  selectImg: function(e) {
    console.log(e)
    var imgId = e.currentTarget.dataset.id
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        that.loadImg(tempFilePaths[0], imgId);
      }
    })
  },

  loadImg: function(data, imagId) {
    wx.showLoading({
      title: '上传中...',
    })
    var _this = this;
    wx.uploadFile({
      url: ajax_url + '/file/fileUpload',
      filePath: data,
      name: "file",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        var json = JSON.parse(res.data) // 此处转换
        var dataImg = JSON.stringify(json.data);
        console.log(json.data.showFile)
        if (json.code == 200) {
          if (imagId == 1) {
            _this.setData({
              dataImage1: json.data.showFile,
              dataImageOne: json.data.path
            })
          } else if (imagId == 2) {
            _this.setData({
              dataImage2: json.data.showFile,
              dataImageTwo: json.data.path
            })
          } else if (imagId == 3) {
            _this.setData({
              dataImage3: json.data.showFile,
              dataImageThree: json.data.path
            })
          }
          wx.showToast({
            title: "图像上传成功！",
            icon: "none",
            duration: 1500,
            mask: true
          });
        } else {
          wx.showModal({
            content: json.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }

      },
      fail: function(res) {
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
      }

    })
  },

  // 获取退换货详情
  getReturnList: function(orderId) {
    var _this = this;
    var data = {
      pageNum: 1,
      pageSize: 10,
      data: {
        status: '',
        memberId: wx.getStorageSync('useId'),
        orderId: orderId
      }
    }
    wx.request({
      url: ajax_url + '/return/mb/apply',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          console.log(res.data.data.records)
          _this.setData({
            orderList: res.data.data.records[0].itemList
          });
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },
  // 申请服务
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log()
    this.setData({
      index: e.detail.value,
      servelNull: '0',
      applyServer: this.data.serviceArray[e.detail.value].value
    })
  },
  // 申请原因
  bindPickeR: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.reasonArray[e.detail.value].text)
    this.setData({
      index1: e.detail.value,
      reasonNull: '0',
      retReason: this.data.reasonArray[e.detail.value].text
    })
  },
  // 具体说明
  phoneInput: function(e) {
    var _this = this;
    _this.setData({
      userRemark: e.detail.value
    })
  },

  //单选
  checkboxChange: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length;
    var checkid = e.target.dataset.checkid;
    var list = that.data.orderList;
    var listLen = list.length;
    var zpricenum = e.currentTarget.dataset.zpricenum; //选中商品数量
    var num = 0
    if (valLen != 0) { //选中
      for (var i = 0; i < listLen; i++) {
        if (list[i].goodsId == checkid) {
          console.log(list[i].goodsId + 'if' + checkid)
          if (!list[i].checkeditem) {
            list[i].checkeditem = true;
            console.log('未选中状态');
            num = num + 1;
            console.log('--' + num)
            // that.data.shopCarId.push(list[i].id)//购物车id
            that.data.arr.push(list[i]); //选中商品数组
            that.data.priceArr.push(list[i].price * zpricenum); //价格数组
          }
        } else {
          if (list[i].checkeditem) {
            console.log(list[i].goodsId + 'else' + checkid)
            num = num + 1;
            console.log('++' + num)
          }
        }
      }
    } else {
      console.log('单选取消');
      var arrList = []
      var trolleyLen = that.data.arr.length;
      // 去掉数组中取消选中数据
      console.log(listLen + '循环长度')
      console.log(that.data.arr)
      for (var i = 0; i < listLen; i++) {
        if (list[i].goodsId == checkid) {
          if (list[i].checkeditem) {
            for (var j = 0; j < that.data.arr.length; j++) {
              if (list[i].goodsId == that.data.arr[j].goodsId) {
                list[i].checkeditem = false
                that.data.arr.splice(j, 1); //删除选中
                that.data.priceArr.splice(j, 1); //删除金额
              }
            }

            // trolleyLen = trolleyLen - 1
          }
        }
      };
    }
    // 数据跟新
    // 计算总价
    var sum = 0,
      l = that.data.priceArr.length;
    for (var i = 0; i < l; i++) {
      sum += Number(that.data.priceArr[i]);
    }
    if (num == listLen) {
      that.setData({
        checked_all: true, //全选
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum, //选中商品价格
        list: list //页面数据
      })
    } else {
      console.log(that.data.arr.length)
      that.setData({
        checked_all: false, //全选
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum, //选中商品价格
        list: list //页面数据
      });
    }
    // console.log(JSON.stringify(list) + '页面展示数据');
  },
  // 全选
  checkedAll: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var list = that.data.orderList
    var listLen = list.length
    var priceArr = that.data.priceArr;

    console.log(valLen)
    if (valLen != 0) {
      console.log(that.data.arr + '全选选中')
      console.log(list)
      for (var i = 0; i < listLen; i++) {
        list[i].checkeditem = true;
        that.data.arr.push(list[i]); //ID数组
        that.data.priceArr.push(that.data.orderList[i].price * that.data.orderList[i].num) //价格数组
      }
      var sum = 0,
        l = that.data.priceArr.length;
      for (var i = 0; i < l; i++) {
        sum += Number(that.data.priceArr[i]);
      }
      console.log(that.data.arr)
      that.setData({
        checked_all: true, //全选
        orderList: list,
        priceArr: priceArr,
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum //选中商品价格
      })
    } else {
      console.log(that.data.arr + '取消全选')
      for (var i = 0; i < listLen; i++) {
        list[i].checkeditem = false
      }
      that.data.arr = [];
      that.setData({
        arr: [],
        priceArr: [],
        checked_all: false,
        orderList: list,
        totalNumber: 0, //选中商品数量
        totalPrice: 0 //选中商品价格
      })
    }
  },

  // 提交申请
  getRefund: function() {
    var _this = this;
    if (!_this.data.applyServer) {
      wx.showModal({
        content: '请检查申请服务类型',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    } else if (!_this.data.retReason) {
      wx.showModal({
        content: '请检查退款原因',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    } else if (_this.data.retReason == '商品质量问题') {
      if (!_this.data.userRemark) {
        wx.showModal({
          content: '请检查具体说明',
          confirmColor: '#6928E2',
          showCancel: false,
        })
        return;
      }
    } else if (_this.data.arr.length == 0) {
      wx.showModal({
        content: '请选择商品',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    }
    var _this = this;
    // if (_this.data.dataImage1) {
    //   _this.data.dataImage1 = '';
    // } else if (_this.data.dataImage2) {
    //   _this.data.dataImage2 = '';
    // } else if (_this.data.dataImage3) {
    //   _this.data.dataImage3 = '';
    // }
    var data = {
      applyServer: _this.data.applyServer, //申请服务 1- 退货、2-换货、3-仅退款、4-补发货
      itemList: _this.data.arr,
      orderId: _this.data.orderId, //订单id
      pictrue: _this.data.dataImageOne + ',' + _this.data.dataImageTwo + ',' + _this.data.dataImageThree, //退换货的图片
      retReason: _this.data.retReason, //退款原因
      userRemark: '' //用户备注
    }
    wx.request({
      url: ajax_url + '/return/mb/refund',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showModal({
            content: '提交成功',
            confirmColor: '#6928E2',
            showCancel: false,
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 500)
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
    console.log(data)
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})