<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="btnCancel"
  >
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox
        v-for="item in roleList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 底部 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="addRole()"
        >确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/api'
export default {
  name: 'AssignRole', // 分配角色弹窗
  props: {
    userId: {
      type: String,
      default: ''
    },
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [], // 用户当前所拥有的角色id
      roleList: [] // 存储所有角色信息
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async addRole() {
      const data = await api.assignRole({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      console.log('分配角色', data)
    },
    btnCancel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    // 获取所有角色信息
    async getRoleList() {
      const { rows } = await api.getAllRol({ page: 1, pageSize: 20 })
      this.roleList = rows
    },
    // 这个方法是父组件调用的
    async getUserInfo(id) {
      // 这里不是能直接 this.userId 因为 props 传值是异步的
      const { roleIds } = await api.getUserBaseInfo(id)
      this.roleIds = roleIds
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
