<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel"
    @open="openDialog"
  >
    <!-- 表单 -->
    <el-form label-width="120px">
      <el-form-item label="姓名">
        <el-input
          v-model="formData.username"
          style="width:100%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机">
        <el-input
          v-model="formData.mobile"
          style="width:100%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width:100%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式">
        <el-select
          v-model="formData.formOfEmployment"
          style="width:100%"
          placeholder="请选择"
        >
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号">
        <el-input
          v-model="formData.workNumber"
          style="width:100%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="formData.departmentName"
          :options="deptList"
          style="width:100%"
          :props="{ value: 'id', label: 'name' }"
        />
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width:100%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button
            type="primary"
            size="small"
          >确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/enumerate/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'EmployessInfo',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      deptList: [],
      EmployeeEnum: EmployeeEnum
    }
  },
  created() {

  },
  methods: {
    btnCancel() {
      this.$emit('update:showDialog', false)
    },
    openDialog() {
      this.getDepartments()
    },
    async getDepartments() {
      this.loading = true
      try {
        const { depts } = await getDepartments()
        this.deptList = tranListToTreeData(depts, '')
        console.log('this.deptList', this.deptList)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log('err', err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
