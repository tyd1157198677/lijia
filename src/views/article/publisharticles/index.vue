<template>
  <div class="publish">
    <div class="app-container editorapp">
      <div class="title-box">
        <input
          type="text"
          class="title"
          maxlength="30"
          v-model="article.title"
          placeholder="请输入文章标题（最多30个字）"
        />
        <!-- <el-button type="text" @click="openDialog">提交</el-button> -->
      </div>
      <!--v-bind:class="{on:scrollheighton }" -->
      <div class="editorname">
        <editor
          v-model="content"
          ref="geteditor"
          :scrollheight="scrollheight"
          :min-height="500"
          class="editor"
        ></editor>
      </div>

      <el-form class="formttype" label-position="left" label-width="100px">
        <el-form-item label="分类：">
          <el-select
            placeholder="文章分类"
            v-model="article.typeId"
            clearable
            size="mini"
            style="width:235px"
          >
            <el-option
              v-for="dict in checkboxs"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签：" style="width:fit-content">
          <el-checkbox-group class="biaoqianWh" v-model="article.tags" size="mini" :max="3">
            <el-checkbox
              border
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            >{{ dict.dictLabel }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="封面：">
          <!-- 上传 -->
          <oss ref="getdata" :article="article"></oss>
          <p
            style="margin: 0;
    padding: 0;
    line-height: 1;
    margin-bottom: 20px;
    color: #9f9f9f;"
          >高质量封面会提高阅读量，默认显示文章第一张图片。</p>
        </el-form-item>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-form-item label="作者：" v-if="!articleIdtrue">
          <el-select
            placeholder="文章作者"
            v-model="article.appUserId"
            clearable
            size="mini"
            style="width:235px"
          >
            <el-option
              v-for="dict in typeauthor"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="footer">
        <div class="fotterleft">
          <!-- <el-button @click="handleCancel">取 消</el-button> -->
          <el-button class="fabu" type="primary" @click="handleSubmit" v-if="!fabuing">发布</el-button>
          <el-button class="fabu" type="primary" v-if="fabuing">发布中</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  postArticle,
  appUser,
  getselectArticleDetail,
  updateArticle,
} from '@/api/system/article/publisharticles'
import local from '@//utils/local'
export default {
  name: 'publisharticles',
  data() {
    return {
      showDialog: false,
      categories: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      // 状态数据字典
      typeOptions: [],
      checkboxs: [],
      typeauthor: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      content: '',
      articleIdtrue: '',
      scrollheight: '0',
      scrollheighton: false,
      article: {
        title: '',
        content: '',
        typeId: '',
        tags: [],
        coverHtml: '',
        appUserId: '',
        thumbnailUrl: '',
        articleId: '',
      },
      newarrimg: [],
      fabuing: false,
    }
  },
  created() {
    this.getDicts('dic_article_type').then((response) => {
      this.checkboxs = response.data
      this.getDicts('dic_article_tag').then((response) => {
        this.typeOptions = response.data
        let articleId = local.get('publisharticlesedit')
        if (articleId) {
          this.getselectArticle(articleId)
        }
        setTimeout(local.remove('publisharticlesedit'), 300000)
      })
    })
    appUser(this.queryParams).then((res) => {
      this.typeauthor = res.rows
    })
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll) // 监听（绑定）滚轮滚动事件
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getselectArticle(articleId) {
      // 修改文章数据
      getselectArticleDetail(articleId).then((response) => {
        this.articleIdtrue = articleId
        this.article.title = response.data.title
        this.article.content = response.data.content
        this.article.coverHtml = response.data.coverHtml
        this.article.thumbnailUrl = response.data.coverHtml
        this.article.articleId = response.data.articleId
        for (var i = 0; i < this.typeauthor.length; i++) {
          if (this.typeauthor[i].nickName == response.data.nickName) {
            this.article.appUserId = this.typeauthor[i].userId
          }
        }
        this.article.typeId = response.data.typeId
        var tags = []
        for (var i = 0; i < this.typeOptions.length; i++) {
          for (var u = 0; u < response.data.tagList.length; u++) {
            if (this.typeOptions[i].dictLabel == response.data.tagList[u]) {
              tags.push(this.typeOptions[i].dictValue)
            }
          }
        }
        this.article.tags = tags
        this.content = this.article.content
      })
    },
    // 断言 target 为非空
    assertNotEmpty(target, msg) {
      if (!target) {
        this.$message({
          message: msg,
          type: 'warning',
        })
        return false
      }
      return true
    },

    // 关闭tag时调用
    // handleTagClose(tag) {
    //   this.article.tags.splice(this.article.tags.indexOf(tag), 1);
    // },

    handleCancel() {
      this.showDialog = false
    },
    handleScroll() {
      let scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop //滚动高度
      this.scrollheight = scrollHeight
      // if(scrollHeight>100){
      //   this.scrollheighton=true
      // }else{
      //    this.scrollheighton=false
      // }
    },
    //图片转成file格式
    tempImage(imgLink) {
      var vm = this
      var file
      var tempImage = new Image()
      //如果图片url是网络url，要加下一句代码

      tempImage.src = imgLink
      tempImage.crossOrigin = '*'
      tempImage.onload = function () {
        var base64 = vm.$refs.geteditor.getBase64Image(tempImage)
        var imgblob = vm.$refs.geteditor.base64toBlob(base64)
        const aTime = new Date().getTime() //取时间戳，给文件命名
        const fileName = aTime + '.png' //给文件名加后缀
        file = new window.File([imgblob], fileName, {
          type: imgblob.type,
        })
        var image = {
          file: file,
          oddimg: imgLink,
        }

        vm.newarrimg.push(image)
        return file
      }
    },
    handleSubmit() {
      var arrimgs = []
      var vm = this
      vm.content.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        function (match, capture) {
          arrimgs.push(capture.substring(0, capture.lastIndexOf('?')))
        }
      )

      vm.newarrimg = []

      for (var i = 0; i < arrimgs.length; i++) {
        var imgs = arrimgs[i].substring(0, arrimgs[i].lastIndexOf('.com/'))
        if (imgs != 'https://oss-img.lijiazhengli') {
          vm.tempImage(arrimgs[i])
        }
      }
      setTimeout(function () {
        if (vm.newarrimg != []) {
          vm.$refs.geteditor.handleHttpRequests(vm.newarrimg)
          setTimeout(function () {
            vm.Article()
          }, 1000)
        } else {
          vm.Article()
        }
      }, 100)
    },
    Article() {
      var vm = this
      vm.fabuing = true
      if (vm.$refs.getdata.thumbnailUrl == '') {
        var arrimg = []
        vm.content.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function (match, capture) {
            arrimg.push(capture)
          }
        )
        if (arrimg != null && arrimg.length > 0) {
          var imgs = arrimg[0].substring(0, arrimg[0].lastIndexOf('.com/'))
          if (imgs == 'https://oss-img.lijiazhengli') {
            vm.article.coverHtml = arrimg[0]
            vm.article.thumbnailUrl = arrimg[0]
          }
        }
      } else {
        vm.article.coverHtml = vm.$refs.getdata.thumbnailUrl
        vm.article.thumbnailUrl = vm.$refs.getdata.thumbnailUrl
      }
      vm.content = vm.content.replace(/%/g, '%25')
      let reg = new RegExp('width="100%"', 'g') //g代表全部
      let newMsg = vm.content.replace(reg, '')
      let msgStr = Base64.encode(decodeURIComponent(newMsg))
      vm.article.content = msgStr

      vm.showDialog = false
      if (vm.article.articleId) {
        updateArticle(vm.article).then((res) => {
          vm.$notify({
            title: '提示',
            message: `文章《${vm.article.title}》修改成功`,
            type: 'success',
          })
          local.remove('publisharticlesedit')
          // this.$router.push("/article/articles");
          vm.$router.replace({
            path: '/article/article',
          })
        })
      } else {
        if (
          vm.assertNotEmpty(vm.article.title, '请填写文章标题') &&
          vm.assertNotEmpty(vm.article.content, '请填写文章内容') &&
          vm.assertNotEmpty(vm.article.typeId, '文章分类不能为空') &&
          vm.assertNotEmpty(vm.article.tags, '文章标签不能为空') &&
          vm.assertNotEmpty(vm.article.appUserId, '请填写文章作者')
        ) {
          postArticle(vm.article).then((res) => {
            vm.$notify({
              title: '提示',
              message: `文章《${vm.article.title}》发布成功`,
              type: 'success',
            })
            local.remove('publisharticlesedit')
            // this.$router.push("/article/articles");
            vm.$router.replace({
              path: '/article/article',
            })
          })
        } else {
          vm.fabuing = false
        }
      }
    },
  },

  handleRemove() {
    return this.article.title
  },
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  },
  handleDownload(file) {},
}
</script>

<style lang="scss">
.publish {
  background: #f8f8f8;
  padding-top: 55px;
  padding-bottom: 85px;
}
.editorapp {
  width: 850px;
  margin: auto;
  position: relative;
  background: #fff;
}
.editorapp .editorname .ql-toolbar.ql-snow {
  position: fixed;
  top: 0;
  background: #f8f8f8;
  z-index: 999;
  width: 850px;
  padding: 12px 20px 12px;
  margin-left: -20px;
}
.editorapp .editor {
  margin-bottom: 20px;
}
.editorapp .formttype {
  clear: both;
  width: 730px;
  margin: 0 auto;
  border-top: 1px solid #e3e3e3;
  padding-top: 25px;
}
.editorapp .title-box {
  width: 100%;
}
.editorapp .title {
  width: 730px;
  background: none;
  color: #1b1c21;
  text-indent: 0px;
  outline: none;
  font-size: 20px;
  text-align: left;
  font-weight: bold;
  display: block;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
  line-height: 2.5;
  overflow: visible;
  padding: 10px 0px;
  margin: 0 40px;
}
.editorapp .title:focus {
  border-color: #409eff;
}
.editorapp .el-tag + .el-tag {
  margin-left: 10px;
}
.editorapp .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.editorapp .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.editorapp .add-category-btn {
  margin-left: 10px;
}
.editorapp .editorname {
  // height: 600px;
  min-width: 810px;
}

.editorapp .footer {
  position: fixed;
  bottom: 0;
  background: #fafafa;
  z-index: 999;
  width: 100%;
  left: 0;
  min-width: 860px;
  border-top: 1px solid #e3e3e3 !important;
  padding: 12px 10% 12px;
}
.fotterleft {
  width: 730px;
  margin: 0 auto;
}
.editorapp .fabu {
  width: 235px;
}
.editorapp .biaoqianWh {
  max-height: 145px;
  margin-top: 6px;
  overflow: auto;
}
.editorapp .biaoqianWh label {
  margin-left: 0 !important;
  margin-right: 5px;
}
.editorapp .el-checkbox.is-bordered.is-checked,
.editorapp .el-checkbox.is-bordered {
  border: 0;
}
.editorapp .el-form-item {
  margin-bottom: 12px;
}
.ql-snow.ql-toolbar button,
.ql-snow .ql-toolbar button {
  padding: 0;
  margin-right: 10px;
}
</style>
