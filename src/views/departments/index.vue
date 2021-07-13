<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <div class="app-container">
      <el-card>
        <departMents-tree :tree-node="company" />
        <el-tree
          :data="list"
          :props="defaultProps"
          :default-expand-all="true"
          empty-text="数据加载中"
        >
          <template slot-scope="{ data }">
            <departMents-tree
              :tree-node="data"
              :is-root="true"
              @delDepts="getDepartments"
              @addDepts="addDepts"
              @editDepts="editDepts"
            />
          </template>
        </el-tree>
      </el-card>
    </div>
    <add-depart
      ref="editDeparts"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import departMentsTree from './components/departmentsTree'
import addDepart from './components/addDepart'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Department',
  components: {
    departMentsTree,
    addDepart
  },
  data() {
    return {
      loading: true,
      showDialog: false,
      node: null, // 记录当前点击的部门node
      company: {
        name: '',
        manager: '负责人',
        id: ''
      },
      list: [],
      // 树组件
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 打开弹窗-新增
    addDepts(node) {
      console.log('数据', node)
      this.showDialog = true
      this.node = node
    },
    // 打开弹窗-编辑
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs['editDeparts'].getDepartDetial(node.id)
    },
    // 获取组织架构数据
    async getDepartments() {
      this.loading = true
      try {
        const { companyName, depts } = await getDepartments()
        this.company['name'] = companyName
        this.list = tranListToTreeData(depts, '')
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
.dashboard-container {
  height: calc(100vh - 50px);
}
</style>
