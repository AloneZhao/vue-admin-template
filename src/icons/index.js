import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/) // 读取所有 .svg的文件

// 以下两行代码就是将所有的svg目录下所有的 .svg文件全部引入到项目中
const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(req)
