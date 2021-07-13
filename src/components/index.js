// 注册全局组件
import pageTools from '@/components/pageTools'
import uploadExcel from '@/components/uploadExcel'

export default {
  install (Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('uploadExcel', uploadExcel)
  }
}
