<template>
  <div>
    <!-- <div class="user-info-head" @click="editCropper()">
      <img
        v-bind:src="options.img"
        title="点击上传封面"
        class="img-circle img-lg"
      />
    </div>-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog()"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :outputSize="options.outputSize"
            :enlarge="options.enlarge"
            :full="options.full"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <!-- :http-request="handleHttpRequest" -->
            <!-- :http-request="requestUpload" -->
            <el-button size="mini">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button icon="el-icon-plus" size="mini" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-minus" size="mini" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-refresh-left" size="mini" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="el-icon-refresh-right" size="mini" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="mini" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import Client from '../../utils/Client'
import { ailoss } from '@/api/system/oss.js'

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: '修改封面',
      options: {
        img: 'https://oss-img.lijiazhengli.com//img/CQZD3K_1635237463301.png', //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 353, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        outputSize: 0.5, //裁剪生成图片的质量(可选0.1 - 1)
        full: true, //false按原比例裁切图片，不失真
        enlarge: 1, //图片根据截图框输出比例倍数
      },
      previews: {},
      region: 'oss-cn-hangzhou',
      bucket: 'lijiaoss', //这里选择OSS容器
      percentage: 0,
      url: '', //后台获取token地址
      ClientObj: null,
      dataObj: {},
      expiration: '',
      dialogVisible: true,
      fileList: [],
      files: 100,
      imageUrl: '',
      thumbnail: 2,
      thumbnailUrl: '',
      uploadHeaders: {
        authorization: '*',
      },
      disabled: false,
    }
  },
  created() {
    this.getAliToken()
  },
  watch: {
    url(val) {
      if (val) {
        this.urls.push(val)
      }
    },
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
    // 编辑封面
    editCropper() {
      this.open = true
      this.previews = {}
      this.options.img = ''
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf('image/') == -1) {
        this.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.options.img = reader.result
        }
      }
      return new Promise((resolve, reject) => {
        this.getAliToken()
          .then((response) => {
            if (response) {
              resolve(response)
            } else {
              reject(response)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async handleHttpRequest(option) {
      //上传OSS
      try {
        let vm = this
        vm.disabled = true
        const client = Client(vm.dataObj),
          file = option.file
        //随机命名 指定文件夹img
        const random_name =
          '/img/' +
          vm.random_string(6) +
          '_' +
          new Date().getTime() +
          '.' +
          option.name.split('.').pop()

        // 分片上传文件
        await client
          .multipartUpload(random_name, option, {
            // progress: async function (p) {
            //     let e = {};
            //     e.percent = p * 100;
            //     option.onProgress(e)
            // }
          })
          .then(({ res }) => {
            if (res.statusCode === 200) {
              // 成功之后生成缩略图

              vm.imageUrl = 'https://oss-img.lijiazhengli.com/' + random_name
              vm.thumbnailUrl = random_name
              vm.$parent.showbanner(random_name)
              vm.open = false
              vm.options.img = this.imageUrl
              vm.msgSuccess('修改成功')
              vm.visible = false

              return res.requestUrls
            } else {
              vm.disabled = false
              option.onError('上传失败')
            }
          })
          .catch((error) => {
            vm.disabled = false
            option.onError('上传失败')
          })
      } catch (error) {
        console.error(error)
        this.disabled = false
        option.onError('上传失败')
      }
    },
    // 上传图片
    uploadImg() {
      let formData = new FormData()
      this.$refs.cropper.getCropBlob((data) => {
        // 获取截图的blob数据
        let aTime = new Date().getTime() //取时间戳，给文件命名
        let fileName = aTime + '.png' //给文件名加后缀
        let file = new window.File([data], fileName, { type: data.type }) //blob转file

        this.handleHttpRequest(file) //上传操作
      })
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
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 关闭窗口
    closeDialog() {
      this.options.img = this.imageUrl
      this.visible = false
    },
  },
}
</script>
<style scoped lang="scss">
.shangcfm {
  width: 320px;
  height: 180px;
  border-radius: 0;
  border: 1px solid #ccc;
}
.user-info-head {
  position: relative;
  display: inline-block;
  height: 100px;

  text-align: center;
}
.user-info-head img {
  background: #ccc;
}
.img-lg {
  width: 160px;
  height: 90px;
  border-radius: 0;
}
.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  width: 160px;
  height: 90px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 0%;
}
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(10%, -50%);
  width: 320px;
  height: 180px;
  border-radius: 0;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
</style>
