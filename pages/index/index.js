//index.js
//获取应用实例
const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk
Page({
  data: {
     
  },
  onLoad: function () {
    var that = this;
     wx.getLocation({
       type:"wgs84",
       success: function(res) {
         that.setData({
            'longitude':res.longitude,
            'latitude':res.latitude,
            'iconPath':"../../images/self.png",
            'id':res.id
          })
       },
     })
     
  },
  onShow: function () {
    var that = this;
    // 调用接口
    qqmapsdk.search({
      keyword: 'WC',  //搜索关键词
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/toilet.png", //图标路径
            width: 20,
            height: 20
          })
        }

        mks.push({ // 获取返回结果，放到mks数组中
           
          id: that.data.id,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          iconPath: that.data.iconPath, //图标路径
          width: 20,
          height: 20
        })
        that.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
  
})
