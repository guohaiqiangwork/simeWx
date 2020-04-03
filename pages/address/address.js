const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    title:'我的收货地址',
    region: ['请选择'],
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    receiver:'',
    mobile:'',
    isDefault:1,
    isDefaultD: true,
    addAddressId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.data.items.length)
    // for (var i = 0; i < this.data.items.length; i++) {
    //   this.data.items[i].isTouchMove = false
    // }
    // console.log(this.data.items)
    // this.setData({
    //   items: this.data.items
    // });

    this.getAddressList() //获取地址列表
  },
  // 监听输入框
  nameInput: function(e) {
    var _this = this;
    _this.setData({
      receiver: e.detail.value
    })
  },
  phoneInput: function(e) {
    var _this = this;
    _this.setData({
      mobile: e.detail.value
    })
  },
  addresInput: function(e) {
    var _this = this;
    _this.setData({
      address: e.detail.value
    })
  },
  //列表点击新加地址
  newAddAddress:function(){
    this.setData({
      items:[],
      title:'添加收货地址'
    });
  },
// 地址编辑
  editAddress:function(e){
    console.log(e.currentTarget.dataset.item)
    var editList = e.currentTarget.dataset.item;
    if (editList.isDefault == 1){
      editList.isDefault = true
    }else{
      editList.isDefault = false
    }
    this.setData({
      items: [],
      address: editList.address,
      mobile: editList.mobile,
      receiver: editList.receiver,
      region: [editList.province, editList.city, editList.area],
      isDefault: editList.isDefault,
      addAddressId: editList.id,
      isDefaultD: editList.isDefault,
      title: '修改收货地址'
    });
  },
  // 新增地址
  addAddress: function() {
    var _this = this;
    if (!_this.data.receiver) {
      // wx.showModal({
      //   content: '请输入收货人姓名',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        duration: 1000,
      })
      return;
    } else if (_this.data.mobile.length < 11 || !(/^1[3456789]\d{9}$/.test(_this.data.mobile))) {
      // wx.showModal({
      //   content: '请填写正确手机号',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none',
        duration: 1000,
      })
      return;
    } else if (_this.data.region.length == 1) {
      // wx.showModal({
      //   content: '请选择所在区域',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title: '请选择所在区域',
        icon: 'none',
        duration: 1000,
      })
      return;
    }else if (!_this.data.address) {
      // wx.showModal({
      //   content: '请填写详细地址',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    var data = {
      receiver: _this.data.receiver, //收货人
      mobile: _this.data.mobile, //收货人联系电话
      address: _this.data.address, //具体地址
      memberId: wx.getStorageSync('useId'), //会员主键id
      province: _this.data.region[0], //省
      city: _this.data.region[1], //城市
      area: _this.data.region[2], //区域
      id: _this.data.addAddressId, //地址主键id
      isDefault: _this.data.isDefault, //	是否默认
    }
  // 判断是新增还是修改
  if(_this.data.title == '修改收货地址'){
    wx.request({
      url: ajax_url + '/address/updateAddress',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '修改成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000,
          })
          _this.getAddressList();//获取列表
        } else {
          wx.showToast({
            title:  res.data.message,
            icon: 'none',
            duration: 1000,
          })
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
        }
      }
    })
  }else{
    wx.request({
      url: ajax_url + '/address/save',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '添加成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title:  '添加成功',
            icon: 'none',
            duration: 1000,
          })
          if (app.nativeData.addressf == 'confirmOrder'){
            wx.navigateBack({
              delta: -1
            });
          }else{
            _this.getAddressList();//获取列表
          }
         
        } else {
          wx.showToast({
            title:  res.data.message,
            icon: 'none',
            duration: 1000,
          })
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
        }
      }
    })
  }
  },
  // 选择地址
  replaceAddress:function(e){
    app.nativeData.addressfId = e.currentTarget.dataset.id//地址id
    wx.navigateBack({
      delta: -1
    });
  },
  // 获取地址列表
  getAddressList: function(falg) {
    var _this = this;
    wx.request({
      url: ajax_url + '/address/findAll/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
        
          if (res.data.data.length > 0) {
           var addressList = res.data.data;
            for (var i = 0; i < addressList.length; i++) {
              addressList.isTouchMove = false
            }
            _this.setData({
              items: addressList
            })
          }else{
            _this.setData({
              items: []
            })
          }
       
         
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })

          wx.showToast({
            title:  res.data.message,
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })

  },
  //删除事件
  del: function (e) {
    wx.showLoading({
      title: '删除中...',
    })
    var _this = this;
    wx.request({
      url: ajax_url + '/address/deleteAddress/' + e.currentTarget.dataset.id,
      method: "post",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '删除成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title:  '删除成功',
            icon: 'none',
            duration: 1000,
          })
          _this.getAddressList('del');//刷新列表
        } else {
          wx.showToast({
            title:  res.data.message,
            icon: 'none',
            duration: 1000,
          })
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
        }
      }
    })

    // this.data.items.splice(e.currentTarget.dataset.index, 1)
    // this.setData({
    //   items: this.data.items
    // })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.items.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
 
  //跳转
  goDetail() {
    console.log('点击元素跳转')
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

  },
  //地址点击确定按钮
  bindRegionChange: function(e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 开关默认地址
  switch2Change: function(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 2
      })
    }
  },


})