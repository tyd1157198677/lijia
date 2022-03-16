<template>
  <div class="app-container">
    <el-row>
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="昵称：" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" clearable size="mini" />
        </el-form-item>
        <el-form-item label="手机号：" prop="userMobile">
          <el-input v-model="form.userMobile" placeholder="请输入手机号" clearable size="mini" />
        </el-form-item>
        <el-form-item label="客户状态：" prop="userIntention">
          <el-select v-model="form.userIntention" placeholder="请输入客户状态" clearable size="mini">
            <el-option
              v-for="dict in intention"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户级别：" prop="userLevel">
          <el-select v-model="form.userLevel" placeholder="请输入客户级别" clearable size="mini">
            <el-option
              v-for="dict in level"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
          :data="userList"
          :row-key="getRowKeys" 
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
            label="手机号码"
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
            label="折扣"
            align="center"
            key="discount"
            prop="discount"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.discount}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="类型"
            align="center"
            key="discount"
            prop="discount"
            :show-overflow-tooltip="true"
          ><template slot-scope="scope">
              <span>{{ scope.row}}</span>
            </template>
          </el-table-column>-->
          <el-table-column
            label="客户来源"
            align="center"
            key="customerSource"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.customerSourceName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="客户状态"
            align="center"
            key="userIntention"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userIntentionName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="客户级别"
            align="center"
            key="userLevel"
            prop="userLevel"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userLevelName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            key="createTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime.replace("T", " ") }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handledate(scope.row)">查看</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="35%">
      <div>
        <useradd></useradd>
      </div>
    </el-dialog>
    <!-- 用户详情 -->
    <el-dialog title="用户详情" :visible.sync="detail" width="40%">
      <div class="usedetails">
        <userdetails :detailsrow="detailsrow"></userdetails>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail = false">取 消</el-button>
        <el-button type="primary" @click="detail = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getDicts } from '@/api/middleground/customerManagement/user'
import userdetails from '@/views/customerManagement/user/detail'
import useradd from '@/views/customerManagement/user/add'
export default {
  name: 'customerManagement',
  components: {
    userdetails,
    useradd,
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
      // 是否显示弹出层
      open: false,
      detail: false,
      detailsrow: [],

      // 获取row的key值
      getRowKeys(row) {
        return row.userId
      },
      // 表单参数
      form: {
        createDate: '',
        nickName: '',
        userIntention: '',
        userLevel: '',
        userMobile: '',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      source: [],
      level: [],
      intention: [],
    }
  },
  watch: {},
  created() {
    this.getList()
    //dic_customer_source：客户来源；dic_user_level：用户级别；dic_user_intention用户意向
    //  this.getDicts('dic_customer_source').then((response) => {
    //   this.source = response.data
    // })
    getDicts('dic_user_level').then((response) => {
      this.level = response.data
    })
    getDicts('dic_user_intention').then((response) => {
      this.intention = response.data
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams, this.addDateRange(this.form)).then(
        (response) => {
          var _this = this
          _this.userList = response.rows
          _this.total = response.total
          _this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        createDate: '',
        nickName: '',
        userIntention: '',
        userLevel: '',
        userMobile: '',
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
        createDate: '',
        nickName: '',
        userIntention: '',
        userLevel: '',
        userMobile: '',
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = '添加用户'
    },

    /** 查看按钮操作 */
    handledate(row) {
      this.detail = true
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
          '/system/szm/user/exportPart',
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        )
      }
    },
    handleExportAll() {
      this.download(
        '/system/szm/user/exportAll',
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
