<template>
  <div class="app-details">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号：" prop="orderNumbers">
              <el-input v-model="form.orderNumbers" placeholder="请输入订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left:20px;">
            <el-button type="primary" @click="getList">搜索订单号</el-button>
          </el-col>
        </el-row>
         <el-col :span="12">
            <el-form-item label="订单状态：" prop="payStatus">
              <el-input v-model="form.payStatusName" placeholder="请输入订单状态" readonly />
            </el-form-item>
          </el-col>
        <el-col :span="12">
          <el-form-item label="组织人名称：" prop="responsibleArrangeUserName">
            <el-input v-model="form.responsibleArrangeUserName" placeholder="请选择组织人名称" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织人电话：" prop="responsibleArrangeMobile">
            <el-input   v-model="form.responsibleArrangeMobile" placeholder="请选择组织人电话" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务人员：" prop="distributeUsers">
            <el-input v-model="form.distributeUsersuserName" placeholder="请选择服务人员" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务项目：" prop="itemName">
            <el-input v-model="form.itemName" placeholder="请选择服务项目" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市：" prop="cityName">
            <el-input v-model="form.cityName" placeholder="请选择城市" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="推荐人名称：" prop="recommendUsername">
            <el-input v-model="form.recommendUsername" placeholder="请选择推荐人名称" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人电话：" prop="recommendMobile">
            <el-input v-model="form.recommendMobile" placeholder="请选择推荐人电话" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="服务上门时间：" prop="doorServiceTime">
            <el-input v-model="form.doorServiceTime" placeholder="选择日期" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传图片：" prop="uploadUrl">
            <ImageUpload :Image="form.uploadUrl" ref="ImageUpload"></ImageUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { detailorder, saveOrder } from '@/api/middleground/applicationReview'
export default {
  name: 'editUser',
  props: ['detailsrow'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      form: {
        userName: '',
        mobile: '',
        itemId: '',
        itemName: '',
        itemPrice: '',
        cityId: '',
        provinceId: '',
        bigareaId: '',
        orderNumber: '', 
        orderNumbers: '',
        address: '',
        mobile: '',
        payStatus: '',
        payStatusName:'',
        recommendMobile: '',
        recommendUsername: '',
        remark: '',
        responsibleArrangePhone: '',
        responsibleArrangeUserName: '',
        userName: '',
        distributeUsers: [],
        distributeUsersuserName: '',
      },
      // 表单校验
      rules: {},
    }
  },
  created() {},
  watch: {},
  methods: {
    getList() {
      var that = this
      that.loading = true
      if (that.form.orderNumbers) {
        detailorder(that.form.orderNumbers).then((response) => {
          that.form = response.data
          that.loading = false
          //服务人员
          that.form.distributeUsersuserName = ''
          that.form.remark = ''
          that.form.orderNumber = response.data.orderNumber
          that.form.orderNumbers = response.data.orderNumber
          let newdistributeUsers = []
          that.form.distributeUsers.forEach((row) => {
            var i = {
              userId: row.arrangeUserId,
              userName: row.arrangeUserName,
            }
            newdistributeUsers.push(i)
            that.form.distributeUsersuserName += row.arrangeUserName + ' '
          })
          that.form.distributeUsers = newdistributeUsers
        })
      } 
    },
    cancel() {
      this.loading = false
      this.open = false
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item)
    },

    /** 提交按钮 */
    submitForm: function () {
      let remark = this.form.remark
      let orderNumber = this.form.orderNumber 
      let dialogImageUrl = ''
      if (this.$refs.ImageUpload.dialogImageUrl != undefined) {
        dialogImageUrl = this.$refs.ImageUpload.dialogImageUrl.split('.com')[1]
      }
      this.form = {
        uploadUrl: dialogImageUrl,
        orderNumber: orderNumber,
        remark: remark,
      }

      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveOrder(this.form).then((response) => {
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
            this.msgSuccess('保存成功')
          })
        }
      })
    },
    cancel() {
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
