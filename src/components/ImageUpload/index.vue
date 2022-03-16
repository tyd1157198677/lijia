<template>
  <div class="component-upload-image uploadimg">
    <el-upload
      class="avatar-uploader"
      action
      :drag="true"
      :multiple="true"
      :show-file-list="false"
      :http-request="uploadHttp"
      :before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      list-type="picture-card"
    >
      <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" />
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <!-- <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>-->
  </div>
</template>

<script>
import Client from '@/utils/Client'
import { ailoss } from '@/api/system/oss.js'
export default {
  props: {
    Image: '',
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg'],
    },
  },
  data() {
    return {
      images: [],
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      uploadImgUrl: '', // 上传的图片服务器地址
      fileList: [],
      region: 'oss-cn-hangzhou',
      bucket: 'lijiaoss', //这里选择OSS容器
      dataObj: {},
      metalIcon: '',
      metalLevelDefaultIcon: '',
      metalLevelLightIcon: '',
      dialogImagename:"",
    }
  },
  watch: {
    Image(val, oldVal) {
      //普通的watch监听
      this.dialogImageUrl = val
    },
  },
  created() {
    this.getAliToken()
    this.dialogImageUrl = this.Image
  },
  methods: {
    getDate() {
      const date = new Date(),
        year = date.getFullYear(),
        month =
          date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        hh = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`,
        mm = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
      return `${year}${month}${day}${hh}${mm}`
    },
    getAliToken() {
      //获取Token
      return new Promise((resolve, reject) => {
        ailoss().then((response) => {
          if (response.code == 200) {
            //  const {expiration, tempAk, tempSk, token} = response.data;
            // this.expiration = expiration;

            this.dataObj = {
              region: this.region,
              bucket: this.bucket,
              accessKeyId: response.data.credentials.accessKeyId,
              accessKeySecret: response.data.credentials.accessKeySecret,
              stsToken: response.data.credentials.securityToken,
              cname: true,
            }
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(`移除图片回调`, fileList)
    },

    // 上传前loading加载
    handleBeforeUpload(file) {
      const isJPEG = file.name.split('.')[1] === 'jpeg'
      const isJPG = file.name.split('.')[1] === 'jpg'
      const isPNG = file.name.split('.')[1] === 'png'
      const isLt5M = file.size / 1024 / 1024 < this.fileSize
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片只能是 JPEG/JPG/PNG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('单张图片大小不能超过 5M!')
      }
      this.getAliToken()
      return (isJPEG || isJPG || isPNG) && isLt5M
    },

    /**阿里云OSS上传 */
    uploadHttp({ file }) {
      var that = this
      const fileName =
        '/img/' +
        that.random_string(6) +
        '_' +
        new Date().getTime() +
        '.' +
        file.name.split('.').pop()

      Client(that.dataObj)
        .put(fileName, file, {
          ContentType: 'image/jpeg',
        })
        .then(({ res, url, name }) => {
          //(res, url, name)
          if (res && res.status == 200) {
            if (that.$parent.labelFor == 'metalIcon') {
              that.metalIcon = "/"+name
            } else if (that.$parent.labelFor == 'metalLevelDefaultIcon') {
              that.metalLevelDefaultIcon = "/"+name
            } else if (that.$parent.labelFor == 'metalLevelLightIcon') {
              that.metalLevelLightIcon ="/"+ name
            }
            // 'https://oss-img.lijiazhengli.com/' +
            that.dialogImageUrl =  'https://oss-img.lijiazhengli.com/' +name
          
    
            that.dialogImagename="/"+name
            that.msgSuccess('上传成功')
            // console.log(`阿里云OSS上传图片成功回调`, res, url, name)
          }
        })
        .catch((err) => {
          // console.log(`阿里云OSS上传图片失败回调`, err)
        })
    },
    // 上传失败
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败',
      })
      this.loading.close()
    },

    // 随机生成文件名
    random_string(len) {
      len = len || 32
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678',
        maxPos = chars.length,
        pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = ''
      separator = separator || ','
      for (let i in list) {
        strs += list[i].url + separator
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : ''
    },
  },
}
</script>
<style lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
.uploadimg .el-upload-dragger {
  width: 60px;
  height: 60px;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
.el-upload--picture-card {
  width: 60px;
  height: 60px;
  line-height: 68px;
}
</style>

