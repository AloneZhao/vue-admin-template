<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="width: 100%; height: 40px;"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col>
      <el-row
        type="flex"
        justify="end"
      >
        <el-col :span="4"><span>{{ treeNode.manager }}</span></el-col>
        <el-col :span="4">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  name: 'DepartMentsTree',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'add':
          console.log('add')
          this.$emit('addDepts', this.treeNode)
          break
        case 'edit':
          console.log('edit')
          this.$emit('editDepts', this.treeNode)
          break
        case 'del':
          console.log('del')
          this.$confirm('是否删除此部门?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 如果点击了确定就会进入then
            return delDepartment(this.treeNode.id) // 返回promise对象
          }).then((res) => {
            // 如果删除成功了  就会进入这里 通知父组件 改变组织架构数据
            console.log('res', res)
            this.$message.success('删除部门成功')
            this.$emit('delDepts')
          }).catch(() => {
            console.log('取消删除')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
