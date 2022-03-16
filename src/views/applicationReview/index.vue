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
        <el-form-item label="单号：" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入单号" clearable size="mini" />
        </el-form-item>
        <el-form-item label="城市：" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入城市" clearable size="mini" />
        </el-form-item>
        <el-form-item label="服务项目：" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入服务项目" clearable size="mini" />
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="form.createDate"
            size="mini"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button plain type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-row :gutter="10" class="mb16">
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
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
          :row-key="getRowKeys"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" align="center" />
          <el-table-column
            label="订单号"
            align="center"
            key="orderNumber"
            prop="orderNumber"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="姓名"
            align="center"
            key="nickName"
            prop="nickName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号"
            align="center"
            key="userMobile"
            prop="userMobile"
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
            key="itemName"
            prop="itemName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="组织人"
            align="center"
            key="responsibleArrangeUserName"
            prop="responsibleArrangeUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="服务人"
            align="center"
            key="arrangeUserNames"
            prop="arrangeUserNames"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="上传资料"
            align="center"
            key="isUploadName"
            prop="isUploadName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="创建时间"
            align="center"
            key="createTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handledate(scope.row)">详情</el-button>

              <!-- <el-button type="text" icon="el-icon-edit">拒绝</el-button>
              <el-button type="text" icon="el-icon-edit">确定</el-button>-->
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
      </el-col>
    </el-row>
    <!-- 添加 -->
    <el-dialog :title="titleadd" :visible.sync="add" width="35%" append-to-body>
      <div>
        <add v-if="add" ref="add"></add>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="open" width="35%">
      <div>
        <detail ref="details" :detailsrow="detailsrow"></detail>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listorder } from '@/api/middleground/applicationReview'
import detail from '@/views/applicationReview/detail'
import add from '@/views/applicationReview/add'
export default {
  name: 'arrange',
  components: {
    add,
    detail,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],

      // 显示详情
      showdetails: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: '',

      titleadd: '',
      // 是否显示弹出层
      open: false,
      // 获取row的key值
      getRowKeys(row) {
        return row.arrangeorderNumber
      },
      add: false,
      details: false,
      detailsrow: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
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
      listorder(this.queryParams, this.form).then((response) => {
        this.userList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.add = false

      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {}
      this.resetForm('queryForm')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.form = {}
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.add = true
      this.titleadd = '新建报单'
    },

    /**参与详情按钮操作 */
    handledate(row) {
      this.open = true
      this.title = '报单详情'
      this.detailsrow = row
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.arrangeorderNumber)
    },
    /** 导出按钮操作 */
    handleExport() {
      var ids = {
        ids: this.ids,
      }
      if (this.ids.length != 0) {
        this.download(
          '/system/szm/arrange/order/check/exportOrdersPart',
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        )
      }
    },
    handleExportAll() {
      this.download(
        '/system/szm/arrange/order/check/exportOrdersAll',
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
