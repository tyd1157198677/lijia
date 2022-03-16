<template>
  <div class="app-container">
    <el-row>
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="讲师名称：" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入讲师名称" clearable size="mini" />
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
            label="姓名"
            align="center"
            key="teacherName"
            prop="teacherName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="管理类型"
            align="center"
            key="typeName"
            prop="typeName"
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

          <el-table-column label="展示图" align="center" key="avatar" prop="avatar">
            <template slot-scope="scope" v-if="scope.row.avatar">
              <div class="userAvatar">
                <img :src="scope.row.avatar" class="userAvatar-imgs" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handledate(scope.row)">修改</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
      <div>
        <useradd :detailsrow="detailsrow"></useradd>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArrange } from '@/api/middleground/crm/lecturer'
import useradd from '@/views/crm/lecturer/add'
export default {
  name: 'lecturer',
  components: {
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
      detailsrow: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.teacherId
      },
      // 表单参数
      form: {
        teacherName: '',
      },
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
      listArrange(this.queryParams, this.form).then((response) => {
        var _this = this
        _this.userList = response.rows
        _this.total = response.total
        _this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.detailsrow = []
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        teacherName: '',
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
        teacherName: '',
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.detailsrow = []
      this.title = '添加讲师信息'
    },

    /** 修改按钮操作 */
    handledate(row) {
      this.open = true
      this.detailsrow = row
      this.title = '修改讲师信息'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.teacherId)
    },
    /** 导出按钮操作 */
    handleExport() {
      var ids = {
        ids: this.ids,
      }
      if (this.ids.length != 0) {
        this.download(
          '/system/szm/consumer/exportCourseTeacherPart',
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        )
      }
    },
    handleExportAll() {
      this.download(
        '/system/szm/consumer/exportCourseTeacherAll',
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
.userAvatar-imgs {
  width: 50px;
  height: 50px;
}
.usedetails {
  margin-top: -30px;
}
</style>
