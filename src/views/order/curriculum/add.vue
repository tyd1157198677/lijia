<template>
  <div class="app-details">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话：" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课程：" prop="courseName">
            <el-input v-model="form.courseName" @focus="coursefocus" placeholder="请选择课程" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格：" prop="coursePrice">
            <el-input v-model="form.coursePrice" placeholder="请选择价格" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="开课城市：" prop="coursecity">
            <el-input v-model="form.coursecity" placeholder="请选择开课城市" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间：" prop="starttime">
            <el-input v-model="form.starttime" placeholder="请选择开始时间" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间：" prop="endtime">
            <el-input v-model="form.endtime" placeholder="请选择结束时间" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人名称：" prop="recommendUsername">
            <el-input v-model="form.recommendUsername" placeholder="请选择推荐人名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人电话：" prop="recommendMobile">
            <el-input v-model="form.recommendMobile" placeholder="请选择推荐人电话" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="订单状态：" prop="payStatus">
            <el-select v-model="form.payStatus" placeholder="请选择订单状态">
              <el-option
                v-for="dict in Status"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务备注：" prop="serviceRemark">
            <el-input v-model="form.serviceRemark" placeholder="请输入服务备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancels">取 消</el-button>
    </div>
    <!-- 课程列表 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <div>
        <el-row>
          <el-table
            v-loading="loading"
            ref="course"
            :data="course"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="课程名称"
              align="center"
              key="courseName"
              prop="courseName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="课程开班名称"
              align="center"
              key="className"
              prop="className"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="大区名称"
              align="center"
              key="bigareaName"
              prop="bigareaName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="省份名称"
              align="center"
              key="provinceName"
              prop="provinceName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="城市名称"
              align="center"
              key="cityName"
              prop="cityName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="培训课程开班开始时间"
              align="center"
              key="beginDate"
              prop="beginDate"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="培训课程开班结束时间"
              align="center"
              key="endDate"
              prop="endDate"
              :show-overflow-tooltip="true"
            />
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getAllArrangeUser"
          />
        </el-row>
        <div slot="footer" class="dialog-footer footert">
          <el-button type="primary" @click="submitcourse">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveOrder, getCoursePage } from '@/api/middleground/order/curriculum'
export default {
  name: 'addUser',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中单选数组
      currentRow: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        classId: '',
        courseId: '',
        userName: '',
        mobile: '',
        courseName: ' ',
        coursePrice: '',
        coursecity: '',
        recommendUsername: '',
        recommendMobile: '',
        starttime: '',
        endtime: '',
        payStatus: '',
        remark: '',
        serviceRemark: '',
      },
      // 表单校验
      rules: {
        mobile: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        courseName: [
          { required: true, message: '课程不能为空', trigger: 'blur' },
        ],
      },
      course: [],
      Status: [
        { dictValue: '1', dictLabel: '待支付' },
        { dictValue: '6', dictLabel: '线下付款已收款' },
      ],
    }
  },
  created() {
    this.getList()
    this.getAllArrangeUser()
  },
  watch: {},
  methods: {
    getList() {},
    getAllArrangeUser() {
      getCoursePage(this.queryParams).then((response) => {
        this.total = response.total
        this.course = response.rows
      })
    },

    cancel() {
      this.loading = false
      this.resetForm('form')
      this.open = false
    },

    coursefocus() {
      let that = this
      that.loading = false
      that.open = true
      that.title = '课程列表接口'
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    submitcourse() {
      this.form.classId = this.currentRow.classId
      this.form.courseId = this.currentRow.courseId
      this.form.courseName = this.currentRow.courseName
      this.form.coursePrice = this.currentRow.coursePrice

      this.form.className = this.currentRow.className
      this.form.bigareaId = this.currentRow.bigareaId
      this.form.bigareaName = this.currentRow.bigareaName
      this.form.provinceId = this.currentRow.provinceId
      this.form.provinceName = this.currentRow.provinceName
      this.form.cityId = this.currentRow.cityId
      this.form.coursecity = this.currentRow.cityName
      this.form.starttime = this.currentRow.beginDate
      this.form.endtime = this.currentRow.endDate
      this.loading = false
      this.open = false
    },

    /** 提交按钮 */
    submitForm: function () {
      if (this.form.courseName == ' ') {
        this.form.courseName = ''
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveOrder(this.form).then((response) => {
            this.msgSuccess('保存成功')
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
          })
        }
      })
    },
    cancels() {
      this.form = {}
      this.resetForm('form')
      this.$parent.$parent.cancel()
    },
  },
  mounted() {},
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
.dialog-footer {
  text-align: right;
}
.footert {
  margin-top: 30px;
}
</style>
