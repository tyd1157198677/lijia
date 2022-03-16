<template>
  <div class="app-container">
    <div  class="formClass">
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
     </el-row>
      </div>
    <el-table v-loading="loading" :data="deptList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录id" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="跳转链接" align="center" prop="linkUrl" />
      <el-table-column label="状态" align="center" prop="isenable">
        <template slot-scope="scope">
          <!-- {{scope.row.isenable}} -->
          <span v-if="scope.row.isenable == 0">隐藏</span>
          <span v-if="scope.row.isenable == 1">显示</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="按钮类型" align="center" prop="smallType">
        <template slot-scope="scope">
          <span v-if="scope.row.smallType == '1'">收纳商城</span>
          <span v-if="scope.row.smallType == '2'">咨询整理师</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button 
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button 
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="链接地址：" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="状态：" prop="showOptions">
          <el-radio-group v-model="form.isenable">
            <el-radio
              v-for="dict in showOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="appId：" prop="sourceid">
          <el-input v-model="form.sourceid" placeholder="请输入小程序appId" />
        </el-form-item>
        <el-form-item label="按钮类型：" prop="statusOptions">
          <el-radio-group v-model="form.smallType">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listjump, addjump, jumpSmall } from "@/api/system/link/links";

export default {
  name: "links",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 数据
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
      statusOptions: [
        { dictValue: "1", dictLabel: "收纳商城" },
        { dictValue: "2", dictLabel: "咨询整理师" }
      ],
      showOptions: [
        { dictValue: 0, dictLabel: "隐藏" },
        { dictValue: 1, dictLabel: "显示" }
      ],
      // 表单提交
      form: {
        id: "",
        title: "",
        linkUrl: "",
        isenable: "",
        sourceid: "",
        smallType: ""
      },
      // 表单校验
      rules: {},
      userId: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      this.form = {
        id: "",
        title: "",
        linkUrl: "",
        isenable: "",
        sourceid: "",
        smallType: ""
      };
      listjump().then(response => {
        this.deptList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.form = {
        id: "",
        title: "",
        linkUrl: "",
        isenable: "",
        sourceid: "",
        smallType: ""
      };
      this.open = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加外链数据";
      // this.form.dictType = this.queryParams.dictType;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row;
      this.open = true;
      this.title = "修改外链数据";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.id;
      this.$confirm('是否确认删除id为"' + dictCodes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return jumpSmall(dictCodes);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            addjump(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addjump(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.userAvatar-imgs {
  width: 50px;
  height: 50px;
}
</style>
