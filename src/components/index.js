// 注册全局组件
import pageTools from '@/components/pageTools'
import uploadExcel from '@/components/uploadExcel'
import imageUpload from '@/components/imageUpload'

export default {
  install (Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('uploadExcel', uploadExcel)
    Vue.component('imageUpload', imageUpload)
  }
}
