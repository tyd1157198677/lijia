<template>
  <div class="app-container" style="margin:0 0 20px 0">
    <el-form class="formClass" :model="form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" clearable size="mini" />
      </el-form-item>
      <el-form-item label="作者：" prop="article">
        <el-input v-model="form.article" placeholder="作者" clearable size="mini" />
      </el-form-item>
      <el-form-item label="分类：" prop="articleTypeId">
        <el-select v-model="form.articleTypeId" placeholder="请选择分类" clearable size="mini">
          <el-option
            v-for="dict in checkboxs"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="筛选：" prop="articleScreen">
        <el-select v-model="form.articleScreen" placeholder="请选择筛选" clearable size="mini">
          <el-option
            v-for="dict in articleScreen"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="orderBy">
        <el-select v-model="form.orderBy" placeholder="请选择排序" clearable size="mini">
          <el-option
            v-for="dict in orderBy"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button plain type="primary" size="mini" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-row :gutter="10" class="mb16">
        <el-col :span="1.5">
          <el-button type="success" size="mini" plain icon="el-icon-plus" @click="handleAdd">发布文章</el-button>
        </el-col>
        <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        ></right-toolbar>-->
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="noticeList" class="newartcs">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="封面" align="center" key="coverHtml" prop="coverHtml">
        <template slot-scope="scope" v-if="scope.row.coverHtml">
          <div class="userAvatar" @click="articledetailtrue(scope.row)">
            <img :src="scope.row.coverHtml" class="userAvatar-imgs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="left" prop="title" width="200">
        <template slot-scope="scope">
          <div @click="articledetailtrue(scope.row)" class="eidttitle">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" prop="nickName" />
      <el-table-column label="发布时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览次数" align="center" prop="hits" />
      <el-table-column label="数据" align="center" key="noticeLists" prop="noticeList" width="240">
        <template slot-scope="scope">
          <el-button type="text" @click="listStorestrue(scope.row)">
            <span>收藏({{ scope.row.stores }})</span>
          </el-button>
          <el-button type="text" @click="listLikestrue(scope.row)">
            <span>点赞({{ scope.row.likes }})</span>
          </el-button>
          <el-button type="text" @click="listCommenttrue(scope.row)">
            <span>评价({{ scope.row.likes }})</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="banner图" align="center" key="bannerUrl" prop="bannerUrl">
        <template slot-scope="scope" v-if="scope.row.bannerUrl">
          <div class="userbanner">
            <img :src="scope.row.bannerUrl" class="banner-imgs" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" key="checkStatus" prop="checkStatus">
        <template slot-scope="scope">
          <el-button type="text" @click="handcheckStatus(scope.row)">
            <p v-if="scope.row.checkStatus == '1'">待审核</p>
            <p v-if="scope.row.checkStatus == '2'">不通过</p>
            <p v-if="scope.row.checkStatus == '3'">通过</p>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" key="noticeList" prop="noticeList" width="300">
        <template slot-scope="scope">
          <el-button type="text" @click="handisbanner(scope.row)">
            <span v-if="!scope.row.isbanner">banner区</span>
            <span v-if="scope.row.isbanner">取消banner</span>
          </el-button>
          <el-button type="text" @click="handisrecommend(scope.row)">
            <span v-if="!scope.row.isrecommend">推荐文章</span>
            <span v-if="scope.row.isrecommend">取消推荐</span>
          </el-button>
          <el-button type="text" @click="handedit(scope.row)">
            <span>修改</span>
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)">
            <span style="color:red;">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 文章 -->
    <el-dialog
      class="dialogArtic"
      :title="articledetailrow.title"
      :visible.sync="articledetailtrues"
      width="35%"
    >
      <div>
        <articledetail ref="getbanners" :articledetailrow="articledetailrow"></articledetail>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="articledetailtrues = false">取 消</el-button>
        <el-button type="primary" @click="articledetailtrues = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 评价管理 -->
    <el-dialog title="评价管理" :visible.sync="listCommenttrues" class="dialogWh">
      <div>
        <listComment :listCommentrow="listCommentrow"></listComment>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listCommenttrues = false">取 消</el-button>
        <el-button type="primary" @click="listCommenttrues = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 收藏 -->
    <el-dialog title="收藏" :visible.sync="listStorestrues" width="35%">
      <div>
        <listStores :listStoresrow="listStoresrow"></listStores>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listStorestrues = false">取 消</el-button>
        <el-button type="primary" @click="listStorestrues = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点赞 -->
    <el-dialog title="点赞" :visible.sync="listLikestrues" width="35%">
      <div>
        <listLikes :listLikesrow="listLikesrow"></listLikes>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listLikestrues = false">取 消</el-button>
        <el-button type="primary" @click="listLikestrues = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="文章审核" :visible.sync="shenhe" width="35%">
      <div>
        <div style="margin: 20px 0;">
          <el-radio v-model="shenheradio" label="3">通过文章审核</el-radio>
          <el-radio v-model="shenheradio" label="2">不通过文章审核</el-radio>
        </div>
        <el-input
          type="textarea"
          :rows="5"
          v-if="shenheradio == '2'"
          placeholder="请输入内容"
          v-model="shenhetextarea"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shenhe = false">取 消</el-button>
        <el-button type="primary" @click="shenhes()">确 定</el-button>
      </span>
    </el-dialog>
    <banneross ref="getbanner"></banneross>
  </div>
</template>

<script>
import {
  listNotice,
  updateRecommand,
  delNotice,
  updateBanner,
  updateRecommandWithBanner,
  cancelShowBanner,
  checkStatu,
} from '@/api/system/article/article'

import articledetail from '@/views/components/ArticleDetail'
import listStores from '@/views/components/listStores'
import listLikes from '@/views/components/listLikes'
import listComment from '@/views/components/listComment'
import banneross from '@/components/ImageUpload/banneross'
import local from '@//utils/local'
export default {
  name: 'articles',
  components: {
    banneross,
    articledetail,
    listStores,
    listLikes,
    listComment,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 文章表格数据
      noticeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      typeOptions: [],
      checkboxs: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      articleScreen: [
        { dictValue: '1', dictLabel: '文章推荐' },
        { dictValue: '2', dictLabel: 'banner区' },
      ],
      orderBy: [
        { dictValue: 'create_time', dictLabel: '默认' },
        { dictValue: 'hits', dictLabel: '点击数' },
        { dictValue: 'stores', dictLabel: '收藏数' },
      ],
      // 表单参数
      form: {
        orderBy: 'create_time', // create_time:"", //默认hits,//点击数stores,//收藏数
        title: '',
        article: '',
        articleScreen: '', //"1：文章推荐，2：banner区",
        articleTypeId: '', //文章类别
        checkStatus: '2',
      },
      articledetailtrues: false,
      articledetailrow: [],
      listStorestrues: false,
      listStoresrow: [],
      listLikestrues: false,
      listLikesrow: [],
      listCommenttrues: false,
      listCommentrow: [],
      showbannerrow: '',
      shenhe: false,
      shenheradio: '3',
      shenhetextarea: '',
      shenherow: [],
    }
  },
  created() {
    this.getList()
    this.getDicts('dic_article_type').then((response) => {
      this.checkboxs = response.data
    })
  },

  methods: {
    /** 查询通知公告列表 */
    getList() {
      var _this = this
      _this.loading = true
      listNotice(_this.form, _this.queryParams).then((response) => {
        _this.noticeList = response.data.rows
        _this.total = response.data.total
        _this.loading = false
      })
    },
    articledetailtrue(row) {
      this.articledetailtrues = true
      this.articledetailrow = row
    },
    listStorestrue(row) {
      if (row.stores != '0') {
        this.listStorestrues = true
        this.listStoresrow = row
      } else {
        this.$message('暂无信息')
      }
    },
    listLikestrue(row) {
      if (row.likes != '0') {
        this.listLikestrues = true
        this.listLikesrow = row
      } else {
        this.$message('暂无信息')
      }
    },
    listCommenttrue(row) {
      this.listCommenttrues = true
      this.listCommentrow = row
    },
    // 表单重置
    reset() {
      this.form = {
        orderBy: 'create_time', // create_time:"", //默认hits,//点击数stores,//收藏数
        title: '',
        article: '',
        articleScreen: '', //"1：文章推荐，2：banner区",
        articleTypeId: '', //文章类别
        checkStatus: '2',
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 新增按钮操作 */
    handleAdd() {
      let routeUrl = this.$router.resolve({
        path: '/publisharticles',
      })

      window.open(routeUrl.href, '_blank')
    },
    // 修改页面
    handedit(row) {
      local.set('publisharticlesedit', row.articleId)
      let routeUrl = this.$router.resolve({
        // path: "/article/publisharticles/edit"
        path: '/publisharticles',
      })
      window.open(routeUrl.href, '_blank')
    },
    //banner第一次弹出上传
    handisbanner(row) {
      var _this = this
      let articleId = row.articleId
      let isbanner = row.isbanner
      if (isbanner === 1) {
        cancelShowBanner(articleId).then((response) => {
          _this.getList()
        })
      } else {
        _this.showbannerrow = row
        _this.$refs.getbanner.editCropper()
      }
    },
    // 修改
    baneredit(row) {
      var _this = this
      _this.showbannerrow = row
      _this.$refs.getbanner.editCropper()
    },
    //banner弹出返回
    showbanner(burl) {
      let bannerUrl = burl
      var _this = this
      let articleId = _this.showbannerrow.articleId
      let data = {
        articleId: articleId,
        bannerUrl: bannerUrl,
      }
      if (_this.showbannerrow.bannerUrl) {
        updateBanner(data)
      } else {
        updateRecommandWithBanner(data).then((response) => {
          if (_this.showbannerrow.isrecommend != 1) {
            _this.showbannerrow = ''
            updateRecommand(articleId, 1)
          }
        })
      }
      _this.getList()
    },
    shenhes() {
      let articleId = this.shenherow.articleId
      let shenheradio = this.shenheradio
      let shenhetextarea = this.shenhetextarea
      if (shenheradio == '3') {
        let data = {
          articleId: articleId,
          checkStatus: shenheradio,
        }
        checkStatu(data).then((response) => {
          this.$message({
            type: 'success',
            message: '通过审核!',
          })
        })
        this.shenhe = false
        this.getList()
      } else {
        if (shenhetextarea != '') {
          let data = {
            articleId: articleId,
            checkStatus: shenheradio,
            reason: shenhetextarea,
          }

          checkStatu(data).then((response) => {
            this.$message({
              type: 'success',
              message: '不通过审核!',
            })
          })
          this.shenhe = false
          this.getList()
        } else {
          this.$message({
            type: 'success',
            message: '请输入审核原因!',
          })
        }
      }
    },
    handcheckStatus(row) {
      let articleId = row.articleId
      let check_status = row.checkStatus
      let that = this
      if (check_status == '1') {
        that.shenhe = true
        that.shenherow = row
        //    shenheradio: "3",
        // shenhetextarea:
      } else if (check_status == '2') {
        that
          .$confirm('确定文章通过审核, 是否继续?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            let data = {
              articleId: articleId,
              checkStatus: '3',
            }
            checkStatu(data).then((response) => {
              that.$message({
                type: 'success',
                message: '通过审核成功!',
              })
              that.getList()
            })
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '取消审核',
            })
          })
      } else if (check_status == '3') {
        that
          .$prompt('*原因：', '确定该文章不通过审核？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
          .then(({ value }) => {
            if (value != '') {
              let data = {
                articleId: articleId,
                checkStatus: '2',
                reason: value,
              }
              checkStatu(data).then((response) => {
                this.$message({
                  type: 'success',
                  message: '已审核不通过!',
                })
                that.getList()
              })
            } else {
              that.$message({
                type: 'success',
                message: '请输入审核原因!',
              })
            }
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '取消审核',
            })
          })
      }
    },
    //推荐文章
    handisrecommend(row) {
      let text = row.isrecommend === 0 ? '推荐' : '取消推荐'
      this.$confirm('确认要"' + text + '""' + row.title + '"文章吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          let isrecommend = row.isrecommend === 0 ? 1 : 0
          if (isrecommend === 0) {
            cancelShowBanner(row.articleId)
            return updateRecommand(row.articleId, isrecommend)
          } else {
            return updateRecommand(row.articleId, isrecommend)
          }
        })
        .then(() => {
          this.getList()
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          // row.isrecommend = row.isrecommend === 0 ? 1 : 0;
        })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除"' + row.title + '"文章?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delNotice(row.articleId)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {
          console.log(row)
        })
    },
  },
}
</script>
<style scoped>
.list {
  margin: 0;
  padding: 0;
  padding-bottom: 30px;
}
.newartcs p {
  padding: 0;
  margin: 0;
}
/* 新一版*/
.userAvatar {
  width: 94px;
  height: 40px;
  margin: 0 auto;
}
.userAvatar-imgs {
  min-height: 40px;
  width: 100%;
}
.userbanner {
  width: 71px;
  height: 40px;
  margin: 0 auto;
}
.banner-imgs {
  min-height: 40px;
  width: 100%;
}
.edithand {
  margin: 0;
}
.edithand p {
  float: left;
  width: 30%;
  color: #3676f5;
}
.edithand p.eidtrow {
  width: 15%;
}
.eidttitle {
  margin: 0;
  height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
