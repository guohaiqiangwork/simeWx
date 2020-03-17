// pages/setPassword/setPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    yzm: "",
    telephone: "18686146962",
    newPassword: "",
    confirmNewPassword: "",
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关
    setInter: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  //监听输入的账号
  yzmInp: function(e) {
    this.data.yzm = e.detail.value;
  },

  //监听输入的账号
  newPasswordInp: function(e) {
    this.data.newPassword = e.detail.value;
  },

  //监听输入的账号
  confirmNewPasswordInp: function(e) {
    this.data.confirmNewPassword = e.detail.value;
  },

  /**
   * 获取验证码
   */
  getYzm: function(e) {
    let me = this;
    let yzm = me.data.yzm;
    let telephone = me.data.telephone;
    //console.log(yzm);
    //console.log(telephone);

    if (!me.data.onOff) {
      return;
    } else {
      let times = 60;
      me.data.setInter = setInterval(function() {
        times--;
        if (times < 1) {
          me.setData({
            yzmButtonName: "重新获取"
          });
          me.data.onOff = true;
          clearInterval(me.data.setInter);
        } else {
          me.setData({
            yzmButtonName: times + 's'
          });
          me.data.onOff = false;
        }
      }, 1000);
    }



  },

  /**
   * 保存
   */
  insertFunc: function() {
    let yzm = this.data.yzm;
    let telephone = this.data.telephone;
    let newPassword = this.data.newPassword;
    let confirmNewPassword = this.data.confirmNewPassword;

    if (!yzm) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1500
      })
      return;
    };

    if (!newPassword) {
      wx.showToast({
        title: '请填写新密码',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (newPassword.length > 6) {
      wx.showToast({
        title: '新密码不能大于6位',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    if (!confirmNewPassword) {
      wx.showToast({
        title: '请填写确认密码',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (confirmNewPassword.length > 6) {
      wx.showToast({
        title: '确认密码不能大于6位',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    if (newPassword != confirmNewPassword) {
      wx.showToast({
        title: '请确保密码一致',
        icon: 'none',
        duration: 1500
      })
      return;
    };

    console.log("222");
    //上面已验证时正确的 下面直接开始对接口
  },


})