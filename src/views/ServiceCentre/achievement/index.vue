<template>
  <div class="app-container">
    <el-row>
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="名称：" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入名称" clearable size="mini" />
        </el-form-item>
        <el-form-item label="手机号：" prop="userMobile">
          <el-input v-model="form.userMobile" placeholder="请输入手机号" clearable size="mini" />
        </el-form-item>

        <el-form-item label="城市：" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入城市" clearable size="mini" />
        </el-form-item>

        <el-form-item label="大区：" prop="bigareaName">
          <el-input v-model="form.bigareaName" placeholder="请输入大区" clearable size="mini" />
        </el-form-item>
        <el-form-item label="开始月份：" prop="beginMonth">
          <el-date-picker
            v-model="form.beginMonth"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束月份：" prop="endMonth">
          <el-date-picker
            v-model="form.endMonth"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button plain type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-row :gutter="10" class="mb16">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExportAll"
            >导出所有</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-table
          v-loading="loading"
          :data="userList"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" align="center" />

          <el-table-column
            label="姓名"
            align="center"
            key="userName"
            prop="userName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="城市"
            align="center"
            key="cityName"
            prop="cityName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="大区"
            align="center"
            key="bigareaName"
            prop="bigareaName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="服务项目"
            align="center"
            key="serviceOrderAmount"
            prop="serviceOrderAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="课程"
            align="center"
            key="courseOrderAmount"
            prop="courseOrderAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="商品"
            align="center"
            key="goodsOrderAmount"
            prop="goodsOrderAmount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="总业绩"
            align="center"
            key="totalAmount"
            prop="totalAmount"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listServiceCentre } from '@/api/middleground/ServiceCentre/achievement'
export default {
  name: 'arrange',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.userId
      },
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: '',

      // 是否显示弹出层
      open: false,
      details: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {
        beginMonth: '',
        bigareaName: '',
        cityName: '',
        endMonth: '',
        userMobile: '',
        userName: '',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      level: [],
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listServiceCentre(this.queryParams, this.form).then((response) => {
        this.userList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        beginMonth: '',
        bigareaName: '',
        cityName: '',
        endMonth: '',
        userMobile: '',
        userName: '',
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
      this.form = {
        beginMonth: '',
        bigareaName: '',
        cityName: '',
        endMonth: '',
        userMobile: '',
        userName: '',
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId)
    },
    /** 导出按钮操作 */
    handleExport() {
      var ids = {
        ids: this.ids,
      }
      if (this.ids.length != 0) {
        this.download(
          '/system/szm/statUserPerformance/exportOrdersPart',
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        )
      }
    },
    handleExportAll() {
      this.download(
        '/system/szm/statUserPerformance/exportOrdersAll',
        {
          ...this.form,
        },
        `data_${new Date().getTime()}.csv`
      )
    },
  },
}
</script>
<style scoped>
.userAvatar-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.usedetails {
  margin-top: -30px;
}
</style>
