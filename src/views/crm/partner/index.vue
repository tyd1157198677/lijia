<template>
  <div class="app-container">
    <el-row>
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="名称：" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入名称" clearable size="mini" />
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
        <el-form-item label="合伙人类型：" prop="partnerLevel">
          <el-select v-model="form.partnerLevel" clearable placeholder="请选择合伙人类型">
            <el-option
              v-for="dict in level"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
          :row-key="getRowKeys"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" align="center" />

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
            label="总单量"
            align="center"
            key="sumNum"
            prop="sumNum"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="基础单量"
            align="center"
            key="baseNum"
            prop="baseNum"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="合伙人类型"
            align="center"
            key="partnerLevelName"
            prop="partnerLevelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="text" icon="el-icon-edit" @click="handledate(scope.row)">组织详情</el-button>
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
    <!-- 修改 -->
    <el-dialog :title="titleedit" :visible.sync="edit" width="35%" append-to-body>
      <div>
        <edit ref="details" :detailsrow="detailsrow"></edit>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <div>
        <detail ref="details" :detailsrow="detailsrow"></detail>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPartner, getDicts } from '@/api/middleground/crm/partner'
import detail from '@/views/crm/partner/detail'
import edit from '@/views/crm/partner/edit'
export default {
  name: 'arrange',
  components: {
    edit,
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
      titleedit: '',
      // 是否显示弹出层
      open: false,
      edit: false,
      details: false,
      detailsrow: [],
      // 日期范围
      dateRange: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.userId
      },
      // 表单参数
      form: {
        nickName: '',
        userMobile: '',
        bigareaName: '',
        cityName: '',
        partnerLevel: '',
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
    getDicts('dic_partner_level').then((response) => {
      this.level = response.data
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listPartner(this.queryParams, this.form).then((response) => {
        this.userList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.edit = false
      this.$refs.details.itemNamerow = {
        itemName: '',
      }
      this.$refs.details.getList()
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        nickName: '',
        userMobile: '',
        bigareaName: '',
        cityName: '',
        partnerLevel: '',
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
        nickName: '',
        userMobile: '',
        bigareaName: '',
        cityName: '',
        partnerLevel: '',
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /**参与详情按钮操作 */
    handledate(row) {
      this.open = true
      this.title = '组织详情'
      this.detailsrow = row
    },
    // 修改
    handleEdit(row) {
      this.edit = true
      this.titleedit = '修改'
      this.detailsrow = row
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
          '/system/szm/consumer/exportPartnerPart',
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        )
      }
    },
    handleExportAll() {
      this.download(
        '/system/szm/consumer/exportPartnerAll',
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
