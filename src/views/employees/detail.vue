<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card style="min-height: 85vh;">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="登录账户设置"
            name="first"
          >
            <el-form
              ref="userForm"
              label-width="120px"
              :model="userInfo"
              :rules="rules"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item
                label="姓名:"
                prop="username"
              >
                <el-input
                  v-model="userInfo.username"
                  disabled
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item
                label="密码:"
                prop="password2"
              >
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="editUserInfo"
                >更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            label="个人详情"
            name="second"
          >
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane
            label="岗位设置"
            name="third"
          >
            <component :is="positionComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserBaseInfo } from '@/api/user'
import { saveEmployees } from '@/api/employees'
import userInfo from './components/userInfo.vue'
import positionSetting from './components/positionSetting.vue'
export default {
  name: 'EmployeesDetail',
  components: {
    userInfo,
    positionSetting
  },
  data() {
    return {
      userComponent: 'userInfo',
      positionComponent: 'positionSetting',
      userId: this.$route.params.id,
      activeName: 'first',
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        this.userInfo = await getUserBaseInfo(this.userId)
      } catch (err) {
        console.log('获取信息错误', err)
      }
    },
    // 修改员工信息
    async editUserInfo() {
      try {
        await this.$refs.userForm.validate()
        const data = await saveEmployees({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功')
        console.log('data1', data)
      } catch (err) {
        console.log('err', err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
