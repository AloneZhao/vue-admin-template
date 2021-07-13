<template>
  <div class="dashboard-container">
    <div
      v-loading="loading"
      class="app-container"
    >
      <!-- 头部 -->
      <page-tools :show-befor="true">
        <template v-slot:before>
          共{{ page.total }}条数据
        </template>
        <template v-slot:after>
          <el-button
            size="small"
            type="warning"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="() => { showDialog = true }"
          >新增员工</el-button>
        </template>
      </page-tools>

      <!-- 主体-表格-分页 -->
      <el-card>
        <el-table
          border
          :data="dataList"
          height="calc(100vh - 285px)"
        >
          <el-table-column
            label="序号"
            width="55"
            align="center"
            sortable=""
            type="index"
          />
          <el-table-column
            label="姓名"
            sortable=""
            align="center"
            prop="username"
          />
          <el-table-column
            label="工号"
            sortable=""
            align="center"
            prop="workNumber"
          />
          <el-table-column
            label="聘用形式"
            sortable=""
            align="center"
            :formatter="formatterEmployees"
            prop="formOfEmployment"
          />
          <el-table-column
            label="部门"
            align="center"
            sortable=""
            prop="departmentName"
          />
          <el-table-column
            label="入职时间"
            sortable=""
            align="center"
            prop="timeOfEntry"
          >
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            align="center"
            prop="enableState"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            sortable=""
            align="center"
            fixed="right"
            width="280"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delInfon(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->

        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          layout="prev, pager, next, jumper, total"
          :total="page.total"
          @current-change="handleCurrentChange"
        />

      </el-card>
    </div>

    <employessInfo :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeesList, delEmployessOne } from '@/api/employees'
import employessInfo from './employeesInfo.vue'
import EmployeeEnum from '@/api/enumerate/employees'
export default {
  name: 'EmployeesIndex',
  components: {
    employessInfo
  }, // 员工列表主页
  data() {
    return {
      dataList: [],
      showDialog: false,
      loading: true,
      page: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 翻页
    handleCurrentChange(val) {
      console.log('val', val)
      this.page.page = val
      this.getEmployeesList()
    },
    // 格式化表格中的数据
    formatterEmployees(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 获取数据
    async getEmployeesList() {
      this.loading = true
      try {
        const result = await getEmployeesList(this.page)
        console.log('resutl', result)
        this.dataList = result.rows
        this.page.total = result.total
        this.loading = false
      } catch (err) {
        console.log('err', err)
        this.loading = false
      }
    },
    // 删除信息
    async delInfon(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployessOne(id)
        this.getEmployeesList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
