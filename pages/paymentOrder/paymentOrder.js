const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: false,
    endTime: '', //2018/11/22 10:40:30这种格式也行
    payMoudel: true, //是否展示密码框
    focus: false,
    Length: 6, //输入框个数  
    isFocus: true, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
    payType: '', //支付类型
  },
  password_input: function(e) {
    var that = this;
    var inputValue = e.detail.value;
    if (inputValue.length == 6 ){
      wx.request({
        url: ajax_url + '/account/passwordCheck/' + wx.getStorageSync('useId'),
        method: "post",
        data: { password: inputValue},
        header: {
          'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
          'client': 'APP',
        },
        success: function (res) {
          if (res.data.code == '200') {
           console.log(res);
          } else {
            wx.showModal({
              content: res.data.message,
              confirmColor: '#6928E2',
              showCancel: false,
            })
          }
        }
      })

    }
    // that.setData({
    //   Value: inputValue
    // })
  },

  Tap() {
    var that = this;
    console.log('234')
    that.setData({
      isFocus: true,
    })
  },

  getFocus: function() {
    this.setData({
      focus: !this.data.focus
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    console.log(JSON.parse(options.buyData))
    var buyData = JSON.parse(options.buyData);
    var that = this;
    that.setData({
      endTime: buyData.createTime,
      totalPrice: buyData.totalPrice,
      orderNo: buyData.orderNo
    })
    that.countDown()
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


  // 倒计时
  countDown: function() {
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    console.log('现在在时间' + nowTime)
    var endTime = new Date(that.data.endTime).getTime(); //结束时间（时间戳）
    console.log('结束时间' + endTime)
    var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
    console.log('时间查' + time)
    // 获取天、时、分、秒
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    sec = that.timeFormin(sec)
    that.setData({
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  // 选择支付放肆
  radiochange: function(e) {
    console.log('radio发生change事件，携带的value值为：', e.detail.value);
    this.data.payType = e.detail.value;
  },
  // 关闭密码框
  closeM: function() {
    var that = this
    that.setData({
      payMoudel: true
    });
  },
  // 去支付
  goPay: function() {
    var that = this
    // 余额支付
    if (that.data.payType == 'ye') {
      that.setData({
        payMoudel: false
      });
    } else {
      const openId = wx.getStorageSync("code") // 获取微信的code作为open ID传到后台
      console.log(openId);
     return;
      // payType后台规定的支付方式，orderId 订单id
      http.postRequest('调后台的支付接口', {
          payType: 2,
          orderId: this.data.detail.id,
          code: openId
        },
        (res) => {
          if (res && res.code == 1) {
            var _r = res.data
            wx.requestPayment({ //调起支付
              'timeStamp': _r.timeStamp,
              'nonceStr': _r.nonceStr,
              'package': _r.packageValue,
              'signType': _r.signType,
              'paySign': _r.paySign,
              'success': function(res) { // 接口调用成功的回调函数
                console.log(res);
                //TODO  跳转订单
                wx.navigateTo({
                  url: '/pages/myOrder/myOrder?type=1&list=2',
                })
              },
              'fail': function(res) { // 接口调用失败的回调函数
                console.log('fail:' + JSON.stringify(res));
              }
            })
          }
        },
        (err) => {
          console.log(err);
        });
    }
  }
})