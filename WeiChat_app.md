# 微信小程序

## 小程序生命周期回调

- onLaunch：小程序初始化完成时触发，**全局只触发一次**。
- onShow：小程序启动 或 切入前台时触发。
- onHide：小程序切入后台时触发。

## 页面生命周期回调函数

- onLoad：页面加载时触发，一个页面只会调用一次。
- onReady：页面初次渲染完成时触发，一个页面只调用一次。（代表页面已准备妥当，可以和视图层交互）
- onShow：页面显示/切入前台时触发。
- onHide：页面隐藏/切入后台时触发。
- onUnload：页面卸载时触发。（如`redirectTo`或`navigateBack`到其他页面时）

## 页面事件处理函数（这里只列举两个）

- onPullDownRefresh：监听用户下拉刷新事件。需要在页面配置或全局配置中，将`enablePullDownRefreh`设置为ture（默认是false），此事件才会有效。
  - 可以通过调用`wx.startPullDownRefresh`触发下拉刷新，效果与用户手动下拉刷新一致。
  - 当处理完数据刷新后，`wx.stopPullDownRefresh`可以停止当前页面的下拉刷新。
- onReachBottom：监听用户上拉触底事件。