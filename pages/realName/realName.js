// pages/realName/realName.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
// require('../../utils/binding.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    imgPath: '/image/realName/card@2x.png',
    imgPathF: '/image/realName/cardF@2x.png',
    imgPathUrl: '',
    name: '', //身份证姓名
    idCard: '', //生份证号
    cardTime: '', //生份证有效
    oneCard: '1' //是否显示下一步
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getName() //查询是否实名
  },
  // 查询是否实名
  getName: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/mb/checkVerified/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        console.log(res)
        if (res.data.data) {
          _this.setData({
            oneCard: 3
          })
        }
      }
    })
  },
  // 照片上传
  selectImg: function(e) {
    console.log(e)
    var imgType = e.currentTarget.dataset.type
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        if (imgType == 'fan') {
          that.setData({
            imgPathF: tempFilePaths[0],
            imgPathUrl: '/mb/verificNegative',
            imgType: 'fan',
            upimgPath: tempFilePaths[0]
          })
        } else {
          that.setData({
            imgPath: tempFilePaths[0],
            imgPathUrl: '/mb/verificPositive',
            imgType: 'zheng',
            upimgPath: tempFilePaths[0]
          });

        }
        that.loadImg();
      }
    })
  },
  loadImg: function() {
    wx.showLoading({
      title: '上传中...',
    })
    var _this = this;
    wx.uploadFile({
      url: ajax_url + _this.data.imgPathUrl,
      filePath: _this.data.upimgPath,
      name: "file",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        var json = JSON.parse(res.data) // 此处转换
        console.log(json)
        if (json.code == 200) {
          console.log(JSON.stringify(json.data))
          wx.showToast({
            title: "图像上传成功！",
            icon: "none",
            duration: 1500,
            mask: true
          });
          if (_this.data.imgType == 'zheng') {
            console.log(JSON.stringify(json.data));
            _this.setData({
              name: json.data.name,
              idCard: json.data.idcard
            });
          } else {
            _this.setData({
              cardTime: '2019-09-09'
            });
          }
        } else {
          wx.showModal({
            content: json.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
          // wx.showToast({
          //   title: json.message,
          //   icon: "none",
          //   duration: 1500,
          //   mask: true
          // });
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

  // 上传完下一步
  goOne: function() {
    var _this = this;
    if (!_this.data.idCard) {
      console.log('请上传正面');
      return;
    } else if (!_this.data.cardTime) {
      console.log('请上传反面')
      return;
    }
    _this.setData({
      oneCard: 2
    });
  },
  // 姓名
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 身份证号
  cardInput: function(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  // 保存实名信息
  saveCard: function() {
    wx.showLoading({
      title: '认证中...',
    })
    var _this = this;
    var data = {
      id: wx.getStorageSync('useId'),
      idcard: _this.data.idCard,
      name: _this.data.name,
    }
    wx.request({
      url: ajax_url + '/mb/saveVerific',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          wx.showToast({
            title: "认证成功！",
            icon: "",
            duration: 1500,
            mask: true
          });
          _this.setData({
            oneCard: 3
          })
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