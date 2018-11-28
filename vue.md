# 关于vue的内容

## 对MVVM的理解，及其与MVC的区别

MVVM和MVC都是前端架构方式（架构模式），它通过分离关注点来改进代码组织方式。不同于设计模式(Design Pattern),只是为了解决一类问题而总结出的抽象方法，一种架构模式往往能使用多种设计模式。

MVVM是Model-View-ViewModel的缩写。MVC是Model-View-Controller的缩写。其中，Model和View都是同一个意思。

- Model（模型）：模型与数据库相连，
- View（视图）：呈现给用户的界面
- ViewModel（视图模型）：数据交互方式
- Controller（控制器）：主要是用以连接Model和View的。

MVC与MVVM的区别：
![avatar](./images/vue/MVC.png) ![avatar](./images/vue/MVVM.png)

- MVC各部分间通信都是单向的；MVVM中各部分通信都是双向的。
- mvvm主要解决了mvc中大量 dom操作使得页面渲染性能降低，加载速度变慢，影响用户体验。
- MVC和MVVM的区别并不是ViewModel完全取代了Controller，ViewModel存在目的在于抽离Controller中展示的业务逻辑，而不是替代Controller，

## vue的生命周期（8个）

- beforecreate：vue实例创建前，此时data和$el都没有创建成功，无法访问。
- created：vue实例创建完成，此时data已经可以访问了，$el还没有创建成功。
- beforemount：界面渲染前，$el还不可以访问。
- mounted：界面渲染完成，此时$el已经可以访问了。
- beforeupdate：数据更新前。
- updated：数据更新完成。
- beforedestroy：vue实例销毁前。
- destroyed：vue实例销毁完成。

## vue实现数据双向绑定的原理

Object.defineProperty

## vue组件间数据传递的方式有哪些

1. 父组件向子组件传递
    在父组件书写的子组件标签中通过属性（可以是动态属性）传递给子组件，在子组件中通过props属性接收父组件传过来的数据。
2. 子组件向父组件传递
    在子组件中通过`this.$emit('事件名',data)`将data传递给父组件，在父组件中通过在子组件标签中书写`@事件名="func"`在函数func中可以接收到data。
3. 通过vuex传递
    引用vuex，书写并引入store。在任一组件中都可以通过`commit`和`dispatch`将数据发送到store的`mutation`和`action`属性中，进而将数据更新到store的state属性。在任一组件中，在计算属性computed中通过`this.$store.state.***`或`this.$store.getters.***`获取数据。

## vuex是什么？如何使用？什么情况适用？

vuex是vue的状态管理器。包括state、getters、mutations、actions、modules属性。适用于各非父子组件中需要频繁传递数据，或要共享的数据较多。

- state：存储数据。
- getters：相当于过滤器，可用来筛选部分数据。
- mutations：更新数据。监听数据是由谁提交。
- actions：更新数据，里面可以执行异步操作（如服务器请求），mutations不可以执行异步操作。特殊的是，actions收到的第一个参数不是state，而是一个context提交。需要在actions里面再commit到mutaions中。
- modules：模块划分。可以将每个模块中的数据单独分出来。

## vue路由的history模式和hash模式

不太清楚