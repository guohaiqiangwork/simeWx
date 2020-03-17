// pages/cashMoney/cashMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏
    my_class: true, //是否显示白色
    ishideback: false, //是否显示箭头
    payMoudel: true, //是否展示密码框
    focus: false,
    Length: 6, //输入框个数  
    isFocus: true, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
  },
  password_input: function (e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue.length  == 6){
      wx.navigateTo({
        url: "../cashResult/cashResult",
      })
    }
    that.setData({
      Value: inputValue
    })
  },

  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  getFocus: function () {
    this.setData({
      focus: !this.data.focus
    })
  },
  goBank:function(){
    console.log(9)
    wx.navigateTo({
      url: "../bank/bank",
    })
  },
  //提现
  goMoney:function(){
    this.setData({
      payMoudel: false
    });
  },
  // 关闭密码框
  closeM: function () {
    var that = this
    that.setData({
      payMoudel: true
    });
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})