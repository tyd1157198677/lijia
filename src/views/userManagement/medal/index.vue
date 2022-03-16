<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="勋章类型" align="center" prop="metalTypeName" />
      <el-table-column label="勋章等级" align="center" prop="metalLevel" />
      <el-table-column label="用户昵称" align="center" prop="nickeName" />
      <el-table-column label="勋章名称" align="center" prop="metalName" />
      <el-table-column
        label="点亮图标"
        align="center"
        key="metalLevelLightIcon"
        prop="metalLevelLightIcon"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.metalLevelLightIcon"
            :src="scope.row.metalLevelLightIcon"
            class="userAvatar-imgs"
          />
          <img
            v-if="!scope.row.metalLevelLightIcon"
            src="https:/oss-img.lijiazhengli.com/img/touxiang.png"
            class="userAvatar-imgs"
          />
        </template>
      </el-table-column>

      <el-table-column label="获得时间" align="center" key="awardedTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.awardedTime.replace("T", " ") }}</span>
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
  </div>
</template>

<script>
import { listMetalAwarded } from '@/api/medal'

export default {
  name: 'fans',
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
        pageSize: 10,
        userId: '',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    }
  },
  created() {  
    this.getList()
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true
      const userId = this.$route.query.userId
      this.queryParams.userId = userId 
      listMetalAwarded(this.queryParams).then((response) => {
        this.deptList = response.data.rows
        this.total = response.data.total
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
<style scoped>
.userAvatar-imgs {
  width: 35px;
  height: 35px; 
}
</style>
