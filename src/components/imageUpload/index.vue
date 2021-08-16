<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="removeFile"
      :on-change="fileChange"
      :before-upload="beforUpload"
      :http-request="httpRequest"
      :class="{ 'disable': fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />

    <el-dialog
      title="图片"
      :visible.sync="showDialog"
    >
      <img
        :src="imgUrl"
        style="width:100%; height: 400px;"
        alt=""
      >
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDJQGrBE0VkhNltkKdhTyC8oDKAj12mGTO',
  SecretKey: 'f3B2g39yWnoY0B5jlW0D9oBI7fvuc3C4'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false, // 进度条
      percent: 0,
      showDialog: false,
      imgUrl: '',
      fileList: [],
      currentFileId: null // 记录正在上传文件的id
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length > 0
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      console.log('file', file)
      this.showDialog = true
      this.imgUrl = file.url
    },
    // 文件移除事件
    removeFile(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    fileChange(file, fileList) {
      // console.log('file', file, 'fileList', fileList)
      console.log('fileChange进来了几次')
      this.fileList = fileList.map(item => item)
    },

    // 上传文件前的操作
    beforUpload(file) {
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 拿到此次确定上传文件的id
      this.currentFileId = file.uid
      this.showPercent = true
      return true
    },

    // 自定义上传方法
    httpRequest(params) {
      console.log('params', params)
      if (params.file) {
        cos.putObject({
          Bucket: 'erro-first-1306558784', /* 必须 存储桶名称 */
          Region: 'ap-chengdu', /* 存储桶所在地域，必须字段 */
          Key: params.file.name, /* 必须 */
          StorageClass: 'STANDARD', // 上传的文件类型默认标准形式
          Body: params.file, // 上传文件对象
          onProgress: progressData => {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log('回调函数返回的数据', err || data)
          if (!err && data.statusCode === 200) {
            // 当上传成功后的地址回显到组件中
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileId) {
                // upload 为 true 表示图片已经上传成功 要为后面应用的时候做标记
                return { url: `http://${data.Location}`, upload: true }
              }
            })
            this.showPercent = false
            this.percent = 0
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.disable ::v-deep {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>
