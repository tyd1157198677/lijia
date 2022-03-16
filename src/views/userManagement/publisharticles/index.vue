<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="文章id" align="center" prop="articleId" />
      <!-- <el-table-column label="用户id" align="center" prop="userId" />   -->
      <el-table-column
        label="封面"
        align="center"
        key="coverHtml"
        prop="coverHtml"
      >
        <template slot-scope="scope">
           <div class="userAvatar">
          <img
            v-if="scope.row.coverHtml"
            :src="scope.row.coverHtml"
            class="userAvatar-imgs"
          />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column
        label="点赞数"
        align="center"
        class-name="small-padding fixed-width"
        width="180"
      >
        <template slot-scope="scope">
          <el-button 
            type="text"
            @click="listLikestrue(scope.row)"
            >{{ scope.row.likes }}</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        label="收藏数"
        align="center"
        class-name="small-padding fixed-width"
        width="180"
      >
        <template slot-scope="scope">
          <el-button 
            type="text"
            @click="listStorestrue(scope.row)"
            >{{ scope.row.stores }}</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        label="发布时间"
        align="center"
        key="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.replace("T", " ") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="详情"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button 
            type="text"
            icon="el-icon-edit"
            @click="articledetailtrue(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="评论"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button 
            type="text"
            icon="el-icon-edit"
            @click="listCommenttrue(scope.row)"
            >查看</el-button
          >
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
    <el-dialog
      :title="articledetailrow.title"
      :visible.sync="articledetailtrues"
      width="50%"
    >
      <div>
        <articledetail :articledetailrow="articledetailrow"></articledetail>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="articledetailtrues = false">取 消</el-button>
        <el-button type="primary" @click="articledetailtrues = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="评价管理" :visible.sync="listCommenttrues" width="50%">
      <div>
        <listComment :listCommentrow="listCommentrow"></listComment>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listCommenttrues = false">取 消</el-button>
        <el-button type="primary" @click="listCommenttrues = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="收藏" :visible.sync="listStorestrues" width="50%">
      <div>
        <listStores :listStoresrow="listStoresrow"></listStores>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listStorestrues = false">取 消</el-button>
        <el-button type="primary" @click="listStorestrues = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="点赞" :visible.sync="listLikestrues" width="50%">
      <div>
        <listLikes :listLikesrow="listLikesrow"></listLikes>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listLikestrues = false">取 消</el-button>
        <el-button type="primary" @click="listLikestrues = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleList } from "@/api/system/userManagement/publisharticles";

import articledetail from "@/views/components/ArticleDetail";
import listStores from "@/views/components/listStores";
import listLikes from "@/views/components/listLikes";
import listComment from "@/views/components/listComment";

export default {
  name: "publisharticles",
  components: {
    articledetail,
    listStores,
    listLikes,
    listComment
  },
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
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      userId: "",
      likestrue: false,
      storestrue: false,
      articledetailtrues: false,
      articledetailrow: [],
      listStorestrues: false,
      listStoresrow: [],
      listLikestrues: false,
      listLikesrow: [],
      listCommenttrues: false,
      listCommentrow: []
    };
  },
  created() {
    this.getList();
    const userId = this.$route.query.userId;
    this.userId = userId;
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      getArticleList(this.$route.query.userId, this.queryParams).then(
        response => {
          this.deptList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    articledetailtrue(row) {
      this.articledetailtrues = true;
      this.articledetailrow = row;
    },
    listStorestrue(row) {
      if (row.stores != "0") {
        this.listStorestrues = true;
        this.listStoresrow = row;
      } else {
        this.$message("暂无信息");
      }
    },
    listLikestrue(row) {
      if (row.likes != "0") {
        this.listLikestrues = true;
        this.listLikesrow = row;
      } else {
        this.$message("暂无信息");
      }
    },
    listCommenttrue(row) {
      this.listCommenttrues = true;
      this.listCommentrow = row;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
  }
};
</script>
<style scoped>
.userAvatar {
  width: 94px;
  height: 40px;
  margin: 0 auto;
}
.userAvatar-imgs {
  width: 100%;
}
</style>
