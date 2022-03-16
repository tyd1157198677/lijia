<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column
        label="头像"
        align="center"
        key="userAvatar"
        prop="userAvatar"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.userAvatar"
            :src="scope.row.userAvatar"
            class="userAvatar-imgs"
          />
          <img
            v-if="!scope.row.userAvatar"
            src="https:/oss-img.lijiazhengli.com/img/touxiang.png"
            class="userAvatar-imgs"
          />
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="手机号" align="center" prop="likes" />

      <el-table-column
        label="关注时间"
        align="center"
        key="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.replace("T", " ") }}</span>
        </template>
      </el-table-column>
      <!--     
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button 
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >查看</el-button> 
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getArticleList } from "@/api/system/userManagement/follow";

export default {
  name: "follow",
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
      userId: ""
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
  }
};
</script>
<style scoped>
.userAvatar-imgs {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
</style>
