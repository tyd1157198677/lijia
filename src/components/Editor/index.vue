<template>
  <div>
    <el-upload
      action
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :http-request="handleHttpRequest"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: none"
      ref="upload"
      v-if="this.type == 'url'"
    ></el-upload>
    <div class="editor" ref="editor" :style="styles">
      <div></div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getToken } from '@/utils/auth'
import Client from '../../utils/Client'
import { ailoss } from '@/api/system/oss.js'
export default {
  name: 'Editor',

  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: '',
    },
    // 滚动高度
    scrollheight: {
      default: '',
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 上传文件大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: 'url',
    },
  },
  data() {
    return {
      region: 'oss-cn-hangzhou',
      bucket: 'lijiaoss', //这里选择OSS容器
      dataObj: {},
      expiration: '',
      fileList: [],
      files: 100,
      random_name: '',
      uploadHeaders: {
        authorization: '*',
      },
      disabled: false,
      uploadUrl: process.env.VUE_APP_BASE_API + '/file/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      Quill: '',
      currentValue: '',
      options: {
        theme: 'snow',
        bounds: document.body,
        debug: 'warn',
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片Node.ELEMENT_NODE
            matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
          },

          // 工具栏配置
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            // ["blockquote", "code-block"], // 引用  代码块
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['image'], // 链接、图片、视频 ["link", "image", "video"]
          ],
        },
        placeholder: '请输入内容',
        readOnly: this.readOnly,
      },
      oddfileList: [],
      newfileList: [],
    }
  },

  created() {
    this.getAliToken()
  },
  computed: {
    styles() {
      let style = {}
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`
      }
      if (this.height) {
        style.height = `${this.height}px`
      }

      return style
    },
  },
  watch: {
    value: {
      handler(val) {
        var that = this
        if (val !== that.currentValue) {
          that.currentValue = val === null ? '' : val
          if (that.Quill) {
            that.Quill.pasteHTML(that.currentValue)
          }
        }
      },
      immediate: true,
    },
    scrollheight(val, oldVal) {
      //186
      if (val > 186) {
        // let clas=this.$refs.editor.previousElementSibling.addClass("on");
      }
    },
  },
  mounted() {
    this.init()
    this.getAliToken()
    const editor = this.$refs.editor

    editor.addEventListener('paste', (evt) => {}, false)
  },
  beforeDestroy() {
    this.Quill = null
  },
  methods: {
    init() {
      const editor = this.$refs.editor
      this.Quill = new Quill(editor, this.options)

      // 如果设置了上传地址则自定义图片上传事件
      if (this.type == 'url') {
        let toolbar = this.Quill.getModule('toolbar')
        toolbar.addHandler('image', (value) => {
          this.uploadType = 'image'
          if (value) {
            this.$refs.upload.$children[0].$refs.input.click()
          } else {
            this.quill.format('image', false)
          }
        })
      }
      this.Quill.pasteHTML(this.currentValue)
      this.Quill.on('text-change', (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML
        const text = this.Quill.getText()
        const quill = this.Quill
        this.currentValue = html
        this.$emit('input', html)
        this.$emit('on-change', { html, text, quill })
      })
      this.Quill.on('text-change', (delta, oldDelta, source) => {
        this.$emit('on-text-change', delta, oldDelta, source)
      })
      this.Quill.on('selection-change', (range, oldRange, source) => {
        this.$emit('on-selection-change', range, oldRange, source)
      })
      this.Quill.on('editor-change', (eventName, ...args) => {
        this.$emit('on-editor-change', eventName, ...args)
      })
    },
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
    handleCustomMatcher(node, Delta) {
      let ops = []
      //    Delta.ops = Delta.ops.map(op => {
      //   return {
      //     insert: op.insert
      //   }
      // })

      // var img = { img: Delta.ops[0].insert.image };
      // this.oddfileList.push(img);
      return Delta
    },

    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return dataURL
    },
    base64toBlob(base64) {
      let arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    dataURItoBlob(dataURI, type) {
      var binary = atob(dataURI.split(',')[1])
      var array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: type })
    },
    blobToFile(blob, filename) {
      // edge浏览器不支持new File对象，所以用以下方法兼容
      blob.lastModifiedDate = new Date()
      blob.name = filename
      return blob
    },
    getFileName(url) {
      // 获取到文件名
      let pos = url.lastIndexOf('/') // 查找最后一个/的位置
      return url.substring(pos + 1) // 截取最后一个/位置到字符长度，也就是截取文件名
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
    // 上传前校检格式和大小
    handleBeforeUpload(param) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = param.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      return new Promise((resolve, reject) => {
        this.getAliToken()
          .then((response) => {
            const _this = this
            const imgQuality = 0.2
            const reader = new FileReader()
            const image = new Image()
            image.onload = (imageEvent) => {
              const canvas = document.createElement('canvas')
              const context = canvas.getContext('2d')
              const width = image.width * imgQuality
              const height = image.height * imgQuality
              canvas.width = width
              canvas.height = height
              context.clearRect(0, 0, width, height)
              context.drawImage(image, 0, 0, width, height)
              const dataUrl = canvas.toDataURL(param.type)
              const blobData = _this.dataURItoBlob(dataUrl, param.type)
              resolve(blobData)
            }
            reader.onload = (e) => {
              image.src = e.target.result
            }
            reader.readAsDataURL(param)
            // if (response) {
            //   resolve(response)
            // } else {
            //   reject(response)
            // }
          })
          .catch((err) => {
            reject(err)
          })
      })

      // return true;
    },
    async handleHttpRequest(option) {
      //上传OSS
      try {
        let vm = this
        vm.disabled = true
        const client = Client(this.dataObj),
          file = option.file
        //随机命名 指定文件夹img
        const random_name =
          '/img/' +
          this.random_string(6) +
          '_' +
          new Date().getTime() +
          '.' +
          file.name.split('.').pop()

        this.random_name = random_name

        // 分片上传文件
        await client
          .multipartUpload(random_name, file, {
            // progress: async function (p) {
            //     let e = {};
            //     e.percent = p * 100;
            //     option.onProgress(e)
            // }
          })
          .then(({ res }) => {
            if (res.statusCode === 200) {
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
        //console.error(error);
        this.disabled = false
        option.onError('上传失败')
      }
    },
    handleHttpRequests(option) {
      //复制上传OSS

      for (var oi = 0; oi < option.length; oi++) {
        var vm = this
        vm.disabled = true
        const client = Client(vm.dataObj),
          file = option[oi].file,
          oddimg = option[oi].oddimg

        //随机命名 指定文件夹img
        const random_name =
          '/img/copy' +
          vm.random_string(6) +
          '_' +
          new Date().getTime() +
          '.' +
          file.name.split('.').pop()
        //  vm.random_name = random_name;
        // 分片上传文件

        client
          .multipartUpload(random_name, file, {})
          .then(({ res }) => {
            if (res.statusCode === 200) {
              return new Promise((resolve, reject) => {
                let fileurl = 'https://oss-img.lijiazhengli.com/' + random_name
                var img = { img: fileurl, oddimg: oddimg }
                vm.newfileList.push(img)

                var html = vm.$refs.editor.children[0].innerHTML
                html.replace(
                  /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
                  function (match, capture) {
                    if (oddimg == capture) {
                      vm.$refs.editor.children[0].innerHTML = html.replace(
                        capture,
                        fileurl
                      )
                    }
                  }
                )
              })
              // 调整光标到最后
              //return res.requestUrls;
            } else {
              vm.disabled = false
              option.onError('上传失败')
            }
          })
          .catch((error) => {
            vm.disabled = false
            // option.onError("上传失败");
          })
      }
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
    handleUploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.Quill

      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入图片  res.url为服务器返回的图片地址

      let fileurl = 'https://oss-img.lijiazhengli.com/' + this.random_name
      quill.insertEmbed(length, 'image', fileurl)
      // 调整光标到最后
      quill.setSelection(length + 1)
    },
    handleUploadError(res) {
      this.$message.error('图片插入失败')
    },
  },
}
</script>

<style>
.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
.ql-container.ql-snow {
  top: 0;
  background: #fff;
  opacity: 1;
  /* z-index: 99; */
}
.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  border: 0px solid #e8e8e8;
}
.ql-editor {
  padding: 20px 40px;
}
.ql-editor.ql-blank::before {
  left: 40px;
}
</style>
