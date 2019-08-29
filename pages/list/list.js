// pages/list/list.js
const app = getApp();
const util = require('../../utils/util.js')
const key = 'R3OBZ-GU663-KA73R-3SCOZ-ZFGC2-WFFOY'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkForUpdate();
    app.globalData.listPage = this;
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
    //if(!points[0] || !points[0]["distance"]){
    //    return;
    //}
    var points = app.globalData.points;
    this.setData({
      "points": points
    })
    Object.assign(this, this.options.data); 
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

  },
  showOrientation: function (e) {
    var that = this;
    var toLocation = e.currentTarget.id;
    var latitude = e.currentTarget.dataset.latitude
    var longitude = e.currentTarget.dataset.longitude
    this.setData({
      toLocation: toLocation,
      latitude: latitude,
      longitude: longitude
    })
    var animation = wx.createAnimation({
      duration: 50,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
 hideModal: function () {
   var animation = wx.createAnimation({
     duration: 50,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export(),
       showModalStatus: false
     })
   }.bind(this), 200)
  },
  orientation: function (e) {
      var id = e.currentTarget.id;
      var toLocation = this.data.toLocation;
      var latitude = this.data.latitude;
      var longitude = this.data.longitude;
      if(id === "miniPro"){
        let plugin = requirePlugin('route-plan');
          let referer = '行得通'; //调用插件的app的名称
          let endPoint = JSON.stringify({ //终点
            'name': toLocation,
            'latitude': latitude,
            'longitude': longitude,
          });
          wx.navigateTo({
            url: 'plugin://route-plan/route-plan?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
          });
      }else{
            wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: latitude,
            longitude: longitude,
            name: toLocation,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
  }
})
