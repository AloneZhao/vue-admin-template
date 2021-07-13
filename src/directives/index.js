// 负责管理所有的自定义指令

// 图片错误后 自定义的指令
export const imagerror = {
  // 会在指令放置的当前dom元素插入到节点之后执行
  inserted (dom, options) {
    // dom 当前指令作用的dom对象
    // options 指令中的变量 解释 其中有一个属性 value 就是指令所传的变量值
    // 当图片有地址 但地址没有加载成功 会触发图片的一个事件  ==>  onerror
    dom.onerror = function () {
      // 当图片出现异常的时候，会将图片设置指令传的地址值
      dom.src = options.value // 不能写死
    }
  }
}
