<template>
  <div class="dashboard-container">
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { uploadExcel } from '@/api/employees'
export default {
  name: 'EmployessUploadExcel',
  data() {
    return {}
  },
  methods: {
    async success({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arrData = []

      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(i => {
          userInfo[userRelations[i]] = item[i]

          if (userRelations[i] === 'timeOfEntry' || userRelations[i] === 'correctionTime') {
            userInfo[userRelations[i]] = new Date(this.formatDate(item[i], '/')) // 只有这样, 才能入库
            return
          }
        })
        arrData.push(userInfo)
      })

      await uploadExcel(arrData)
      this.$message.success('导入成功')
      this.$router.back()
    },
    // 格式化导入后时间问题
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      debugger
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
