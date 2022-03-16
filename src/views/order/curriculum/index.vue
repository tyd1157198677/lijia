<template>
  <div class="app-container">
    <el-row>
      <el-form class="formClass" :model="form" ref="queryForm" :inline="true">
        <el-form-item label="名称：" prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请输入名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item label="手机号：" prop="userMobile">
          <el-input
            v-model="form.userMobile"
            placeholder="请输入手机号"
            clearable
            size="mini"
          />
        </el-form-item>

        <el-form-item label="课程项目：" prop="courseName">
          <el-input
            v-model="form.courseName"
            placeholder="请输入课程项目"
            clearable
            size="mini"
          />
        </el-form-item>

        <el-form-item label="推荐人：" prop="recommendUsername">
          <el-input
            v-model="form.recommendUsername"
            placeholder="请输入推荐人"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item label="推荐人手机号：" prop="recommendMobile">
          <el-input
            v-model="form.recommendMobile"
            placeholder="请输入推荐人手机号"
            clearable
            size="mini"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button
            plain
            type="primary"
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
        <el-row :gutter="10" class="mb16">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExportAll"
              >导出所有</el-button
            >
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
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
          />
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
            key="userName"
            prop="userName"
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
            label="课程名称"
            align="center"
            key="courseName"
            prop="courseName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="开课城市"
            align="center"
            key="cityName"
            prop="cityName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="订单支付状态"
            align="center"
            key="payStatusName"
            prop="payStatusName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="推荐人姓名"
            align="center"
            key="recommendUsername"
            prop="recommendUsername"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="折扣"
            width="60px"
            align="center"
            key="discount"
            prop="discount"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="创建时间"
            align="center"
            key="createTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="支付时间"
            width="80px"
            align="center"
            key="payTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handledate(scope.row)"
                >详情</el-button
              >
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >修改</el-button
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
      </el-col>
    </el-row>
    <!-- 添加 -->
    <el-dialog :title="titleadd" :visible.sync="add" width="35%" append-to-body>
      <div>
        <add v-if="add" ref="add"></add>
      </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      :title="titleedit"
      :visible.sync="edit"
      width="35%"
      append-to-body
    >
      <div>
        <edit ref="edit" :detailsrow="detailsrow"></edit>
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
import { getOrderPage } from "@/api/middleground/order/curriculum";
import detail from "@/views/order/curriculum/detail";
import add from "@/views/order/curriculum/add";
import edit from "@/views/order/curriculum/edit";
export default {
  name: "arrange",
  components: {
    edit,
    add,
    detail,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.orderId;
      },
      // 显示详情
      showdetails: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      titleedit: "",
      titleadd: "",
      // 是否显示弹出层
      open: false,
      edit: false,
      add: false,
      details: false,
      detailsrow: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {
        courseName: "",
        recommendMobile: "",
        recommendUsername: "",
        userMobile: "",
        userName: "",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getOrderPage(this.queryParams, this.form).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.detailsrow = [];
      this.open = false;
      this.edit = false;
      this.add = false;

      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        courseName: "",
        recommendMobile: "",
        recommendUsername: "",
        userMobile: "",
        userName: "",
      };
      this.resetForm("queryForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.form = {
        courseName: "",
        recommendMobile: "",
        recommendUsername: "",
        userMobile: "",
        userName: "",
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.add = true;
      this.titleadd = "添加订单";
    },

    /**参与详情按钮操作 */
    handledate(row) {
      this.open = true;
      this.title = "课程订单详情";
      this.detailsrow = row;
    },
    // 修改
    handleEdit(row) {
      this.edit = true;
      this.titleedit = "修改订单";
      this.detailsrow = row;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.orderId);
    },
    /** 导出按钮操作 */
    handleExport() {
      var ids = {
        ids: this.ids,
      };
      if (this.ids.length != 0) {
        this.download(
          "/system/szm/course/order/exportOrdersPart",
          {
            ...ids,
          },
          `data_${new Date().getTime()}.csv`
        );
      }
    },
    handleExportAll() {
      this.download(
        "/system/szm/course/order/exportOrdersAll",
        {
          ...this.form,
        },
        `data_${new Date().getTime()}.csv`
      );
    },
  },
};
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
