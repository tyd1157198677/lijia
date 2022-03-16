<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form class="formClass" :model="queryData" ref="queryForm" :inline="true">
          <el-form-item label="用户名称：" prop="nickName">
            <el-input v-model="queryData.nickName" placeholder="请输入用户名称" clearable size="mini" />
            <!-- @keyup.enter.native="handleQuery" -->
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="queryData.mobile" placeholder="请输入手机号" clearable size="mini" />
            <!-- @keyup.enter.native="handleQuery" -->
          </el-form-item>

      
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button
              plain
              type="primary"
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="userList">
      <!-- <el-table-column type="selection"  align="center" /> -->
      <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
      <el-table-column
        label="用户名称"
        align="center"
        key="nickName"
        prop="nickName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="用户头像" align="center" key="userAvatar" prop="userAvatar">
        <template slot-scope="scope">
          <img v-if="scope.row.userAvatar" :src="scope.row.userAvatar" class="userAvatar-img" />
          <img
            v-if="!scope.row.userAvatar"
            src="https:/oss-img.lijiazhengli.com/img/touxiang.png"
            class="userAvatar-img"
          />
        </template>
      </el-table-column>
      <el-table-column label="微信opendi" align="center" key="openId" prop="openId" />
      <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" />
      <el-table-column label="创建时间" align="center" key="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.replace("T", " ") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="禁用" align="center" key="isDisabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisabled"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="官方编辑" align="center" key="isofficialedit">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isofficialedit"
            active-value="1"
            inactive-value="0"
            @change="handleisofficialeditChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">查看</el-button>
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
import {
  userList,
  changeUserStatus,
  changeUserofficialedit,
} from '@/api/system/userManagement/user'

import userdetails from '../details'

export default {
  name: 'userManagement',
  components: {
    userdetails,
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
      userList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        nickName: '',
        mobile: '',
        beginDate: '',
        endDate: '',
      },
      queryData: {
        nickName: '',
        mobile: '',
        beginDate: '',
        endDate: '',
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
      userList(
        this.addDateRange(this.queryData, this.dateRange),
        this.queryParams
      ).then((response) => {
        var _this = this
        _this.userList = response.rows
        for (var i = 0; i < _this.userList.length; i++) { 
          _this.userList[i].isDisabled = _this.userList[i].isDisabled.toString()
          _this.userList[i].isofficialedit =
            _this.userList[i].isofficialedit.toString()
        }

        _this.total = response.total
        _this.loading = false
      })
    },
    // 官方编辑
    handleisofficialeditChange(row) {
      let text = row.isofficialedit === '1' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.nickName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          changeUserofficialedit(row.userId, row.isofficialedit)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.isofficialedit = row.isofficialedit === '0' ? '1' : '0'
        })
    },
    handleStatusChange(row) {
      let text = row.isDisabled === '0' ? '启用' : '禁用'
      this.$confirm(
        '确认要"' + text + '""' + row.nickName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          changeUserStatus(row.userId, row.isDisabled)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.isDisabled = row.isDisabled === '0' ? '1' : '0'
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
        pageNum: 1,
        pageSize: 20,
        nickName: '',
        mobile: '',
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/user/export',
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      )
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const userId = row.userId
      this.$router.push({
        path: '/userManagement/details/',
        query: { userId: userId },
      })
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
</style>
