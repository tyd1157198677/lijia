<template>
  <div class="app-details">
    <el-row :gutter="20">
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="服务名称：">
          <el-input v-model="form.itemName" placeholder="请输入服务名称" clearable size="mini" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getListService">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="服务名称" align="center" prop="itemName" />
      <el-table-column label="订单金额" align="center" prop="orderAmount" />
      <el-table-column label="组织人" align="center" prop="responsibleArrangeUserName" />
      <el-table-column label="服务人员" align="center" prop="arrangeUserName" />
      <el-table-column label="创建时间" align="center" key="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.replace("T", " ") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color:red;"
            @click="handleUpdate(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getListService"
    />
  </div>
</template>

<script>
import { delUser, getService } from '@/api/middleground/customerManagement/user'
export default {
  name: 'service',
  props: ['userId'],
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
      },
      // 表单参数
      form: {
         itemName:""
      },
      // 表单校验
      rules: {},
    }
  },
  created() {},
  methods: {
    /** 查询文章列表 */
    getListService() {
      this.loading = true
      let userId = this.userId
      getService(this.queryParams, userId, this.form).then((response) => {
        this.deptList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    handleUpdate(row) {
      const orderId = row.orderId
      this.$confirm(
        '是否确认删除订单编号为"' + row.orderNumber + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delUser(orderId, 2)
        })
        .then(() => {
          this.getListService()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
  },
}
</script>
<style scoped>
.userAvatar-imgs {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.detatitle {
  margin-bottom: 20px;
}
.detatitle .el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
.app-details {
  margin: 0 0 20px 0;
  padding-bottom: 20px;
}
</style>
