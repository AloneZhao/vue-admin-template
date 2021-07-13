<template>
  <div class="dashboard-container">
    <div
      v-loading="loading"
      class="app-container setting-wrap"
    >

      <el-card>
        <div
          slot="header"
          class="clearfix"
        >
          <el-button
            icon="el-icon-plus"
            size="small"
            style="float: right;"
            type="primary"
            @click="showDialog = true"
          >新增按钮</el-button>
        </div>

        <el-table
          border=""
          height="calc(100vh - 258px)"
          :data="dataList"
          :header-cell-style="{'text-align': 'center', 'height': '30px', 'font-size': '14px', 'box-sizing': 'border-box'
          }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="120"
            align="center"
          />
          <el-table-column
            label="角色名称"
            width="240"
            prop="name"
            align="center"
          />
          <el-table-column
            label="描述"
            width="605"
            prop="description"
          />
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                size="small"
                type="text"
              >分配权限</el-button>
              <el-button
                size="small"
                type="text"
                @click="editDialog(row.id)"
              >编辑</el-button>
              <el-button
                size="small"
                type="text"
                @click="delRow(row)"
              >删除</el-button>
            </template>

          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          :current-page="page.page"
          :page-size="page.pagesize"
          layout="prev, pager, next, jumper, total"
          :total="page.total"
          @current-change="handleCurrentChange"
        />
      </el-card>

      <!-- 编辑弹窗 -->
      <el-dialog
        title="编辑部门"
        :visible.sync="showDialog"
        @close="btnCancel"
      >
        <el-form
          ref="settingDialog"
          label-width="120px"
          :model="dataInfo"
          :rules="rules"
        >
          <el-form-item
            label="角色名称"
            prop="name"
          >
            <el-input v-model="dataInfo.name" />
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="description"
          >
            <el-input v-model="dataInfo.description" />
          </el-form-item>
        </el-form>

        <el-row
          slot="footer"
          type="flex"
          justify="center"
        >
          <el-col :span="6">
            <el-button
              size="small"
              @click="btnCancel"
            >取消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="btnOK"
            >确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllRol, delRol, getRolDetial, updataRolDetial, addRolDetial } from '@/api/employees'
export default {
  name: 'Setting',
  data() {
    return {
      showDialog: false,
      dataInfo: {
        name: ''
      },

      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },

      // 分页参数
      page: {
        pagesize: 10, // 每页显示的条数
        page: 1, // 当前页码
        total: 0
      },
      loading: true,
      dataList: []
    }
  },
  created() {
    this.getAllRol()
  },
  methods: {
    // 显示弹窗
    async editDialog(id) {
      try {
        const result = await getRolDetial(id)
        this.dataInfo = { ...result }
        this.showDialog = true
        console.log('角色详情数据', result)
      } catch (err) {
        console.log('获取数据失败', err)
      }
    },
    // 弹窗取消
    btnCancel() {
      console.log('取消')
      this.dataInfo = {}
      this.$refs['settingDialog'].resetFields()
      this.showDialog = false
    },
    // 确定按钮
    async btnOK() {
      console.log('确定')
      try {
        await this.$refs['settingDialog'].validate()
        if (this.dataInfo.id) {
          await updataRolDetial(this.dataInfo)
        } else {
          await addRolDetial(this.dataInfo)
        }
        this.getAllRol()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (err) {
        console.log('err', err)
      }
    },
    handleCurrentChange(val) {
      console.log('翻页')
      this.page.page = val
      this.getAllRol()
    },
    // 获取列表数据
    async getAllRol() {
      try {
        const { total, rows } = await getAllRol(this.page)
        this.page.total = total
        this.dataList = rows
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('获取数据失败')
      }
    },
    // 删除某行数据
    delRow(row) {
      this.$confirm(`是否删除${row.name}角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const result = await delRol(row.id)
          console.log('删除成功结果', result)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getAllRol()
        } catch (error) {
          console.log('错误信息', error)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
