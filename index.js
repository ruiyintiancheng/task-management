// import taskClass from './src/views/taskClass'
// import taskConfig from './src/views/taskConfig'
// import notificationManagement from './src/views/notificationManagement'
// import sysConfig from './src/views/sysConfig'
// import taskLog from './src/views/taskLog'
// // 定义 Loading 对象
// const Loading = {
//   // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
//   install: function(Vue) {
//     Vue.component('taskClass', taskClass)
//     Vue.component('taskConfig', taskConfig)
//     Vue.component('notificationManagement', notificationManagement)
//     Vue.component('sysConfig', sysConfig)
//     Vue.component('taskLog', taskLog)
//   }
// }
// // 导出
// export default Loading
module.exports = function(path) {
  const arr = path.split('$taskManagement')
  const component = arr[arr.length - 1]
  return function() {
    return import('./src/views' + component + '.vue')
  }
}
