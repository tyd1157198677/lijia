<template>
  <div class="app-container">
    <div class="htmldep" v-html="deptList.content"></div>

    <div class="htmldeps" v-if="deptList.coverHtml">
      <p>封面图：</p>
      <div class="userAvatar">
        <img :src="deptList.coverHtml" alt />
      </div>
    </div>
  </div>
</template>

<script>
import { getselectArticleDetail } from '@/api/system/article/publisharticles'

export default {
  name: 'selectArticleDetail',
  props: ['articledetailrow'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 部门表格数据
      deptList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userId: '',
      articleId: '',
    }
  },
  created() {},
  watch: {
    articledetailrow: {
      handler(newName, oldName) {
        this.getname()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /** 查询文章列表 */
    getname() {
      this.loading = true
      this.articleId = this.articledetailrow.articleId
      getselectArticleDetail(this.articleId).then((response) => {
        this.deptList = response.data
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
  },
}
</script>
<style>
.dialogArtic .app-container {
  padding: 0;
}
.dialogArtic p {
  line-height: 26px;
}
.htmldep img {
  width: 100% !important;
}
.htmldeps p {
  padding-top: 10px;
  border-top: 5px solid #3676f5;
}
.htmldeps .userAvatar {
  width: 235px;
  height: 100px;
  overflow: hidden;
}
.htmldeps img {
  width: 100%;
}
.el-dialog {
  min-width: 600px;
}
</style>
