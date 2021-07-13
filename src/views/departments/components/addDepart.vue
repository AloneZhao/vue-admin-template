<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 匿名插槽 -->
    <el-form
      ref="addDepart"
      :rules="addDepartRules"
      :model="dataInfo"
      label-width="120px"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="dataInfo.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="dataInfo.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          v-model="dataInfo.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployees"
        >
          <el-option
            v-for="item in employeesList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="dataInfo.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOk"
        >确定</el-button>
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartment, getDepartmentDetial, updataDepart } from '@/api/departments'
import { getEmployees } from '@/api/employees'
export default {
  name: 'AddDepart', // 新增部门弹窗
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 用来接收从父组件所点击的对象值
    treeNode: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    // 部门名称校验
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.dataInfo.id) {
        // 编辑模式
        // 该部门下 除开我之外 同级部门下 再也没有同名的部门
        /**
         * 1. 先找到 this.treeNode 下的所有子部门
         * 2. 再抛开 此次编辑的部门id
         */
        isRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.dataInfo.id).some(i => i.name === value)
      } else {
        // 新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 部门编码校验
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.dataInfo.id) {
        // 编辑
        isRepeat = depts.some(item => item.id !== this.dataInfo.id && item.code === value && value)
      } else {
        // 新增
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      employeesList: [],
      dataInfo: {},
      // 表单校验规则
      addDepartRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.dataInfo.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取员工接口数据
    async getEmployees() {
      try {
        const result = await getEmployees()
        console.log('员工数据', result)
        this.employeesList = result
      } catch (error) {
        console.log('获取员工数据错误', error)
      }
    },
    // 获取组织架构详情
    async getDepartDetial(id) {
      this.dataInfo = await getDepartmentDetial(id)
    },
    // 弹窗的提交事件
    btnOk() {
      // 提交前先校验表单数据
      this.$refs.addDepart.validate(async isOk => {
        // 校验通过，提交数据
        if (isOk) {
          try {
            if (this.dataInfo.id) {
              // 编辑
              const updataResult = await updataDepart(this.dataInfo)
              console.log('updata', updataResult)
            } else {
              // 新增
              const result = await addDepartment({ ...this.dataInfo, pid: this.treeNode.id })
              console.log('result', result)
            }
            this.$message.success('操作成功')

            // 新增成功后，调用父组件下的 @addDepts 重新拉取数据渲染组织机构
            this.$emit('addDepts')

            // 清空数据关闭弹窗
            this.$refs.addDepart.resetFields()
            this.$emit('update:showDialog', false)
          } catch (error) {
            console.log('提交错误', error)
          }
        }
      })
    },
    // 取消
    btnCancel() {
      // el-form中的resetFields不能重置非表单中的数据，所以在取消的位置需要强制加上 重置数据
      this.dataInfo = {}
      this.$refs.addDepart.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
