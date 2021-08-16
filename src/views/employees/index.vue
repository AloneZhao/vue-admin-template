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
            @click="goTo()"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData()"
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
            label="头像"
            align="center"
          >
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
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
                @click="$router.push(`/employees/detail/${row.id}`)"
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
                @click="editRole(row.id)"
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
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
    >
      <el-row
        type="flex"
        justify="center"
      >
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色弹窗 -->
    <assign-role
      ref="assignRoleRef"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeesList, delEmployessOne } from '@/api/employees'
import { formatDate } from '@/filters'
import employessInfo from './employeesInfo.vue'
import EmployeeEnum from '@/api/enumerate/employees'
import AssignRole from './components/assign-role.vue'
import qrCode from 'qrcode'
export default {
  name: 'EmployeesIndex',
  components: {
    employessInfo,
    AssignRole
  }, // 员工列表主页
  data() {
    return {
      showCodeDialog: false,
      showRoleDialog: false, // 角色弹窗
      userId: '', // 用户id
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
    // 打开角色页面
    async editRole(id) {
      this.userId = id
      await this.$refs['assignRoleRef'].getUserInfo(id)
      this.showRoleDialog = true
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          qrCode.toCanvas(this.$refs['myCanvas'], url)
        })
      } else {
        console.log(111)
        this.$message.warning('该用户还没有上传头像')
      }
    },
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
    goTo() {
      this.$router.push({ name: 'employessUploadExcel' })
    },
    formatDataJson(headers, rows) {
      return rows.map(item => {
        const arrItem = []
        Object.keys(headers).map(i => {
          if (headers[i] === 'timeOfEntry' || headers[i] === 'correctionTime') {
            item[headers[i]] = formatDate(item[headers[i]])
          } else if (headers[i] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(item => item.id === item[headers[i]])
            item[headers[i]] = obj ? obj.value : '未知'
          }
          arrItem.push(item[headers[i]])
        })
        return arrItem
      })
    },
    // 导出
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/utils/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeesList({ page: 1, size: this.page.total })
        const data = this.formatDataJson(headers, rows)
        // 将获取到的数据转换成导出需要的数据格式

        /**
         * excel 是引入的文件导出的对象 利用.方法名调用导出excel方法
         * @params {Arrary} header 导出数据的表头
         * @params {[[]]} data 导出的具体数据 一条数据就是一个数组同时必须与表头一一对应
         * @params {String} filename 导出文件名 (excel-list)
         * @params {Boolean} autoWidth 单元格是否要自适应宽度
         * @params {Sting} bookType 导出文件类型 (xlsx, csv, txt, more)
         */
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表'
        })
      })
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
