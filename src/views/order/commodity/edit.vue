<template>
  <div class="app-details">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入姓名" :readonly="disa" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话：" prop="userMobile">
            <el-input v-model="form.userMobile" placeholder="请输入电话" :readonly="disa" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市：" prop="cityName">
            <el-autocomplete
              class="inline-input"
              v-model="form.cityName"
              :fetch-suggestions="querySearchs"
              placeholder="请选择城市"
              @select="handleSelect"
              :readonly="disa"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址：" prop="userAddress">
            <el-input v-model="form.userAddress" placeholder="请输入详细地址" :readonly="disa" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="订单状态：" prop="status">
            <el-input v-model="form.status" placeholder="请输入订单状态" readonly />
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
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  updateOrder,
  orderDetail,
  getCityList,
} from '@/api/middleground/order/commodity'
export default {
  name: 'addUser',
  props: ['detailsrow'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
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
      form: {},
      // 表单校验
      rules: {},
      province: [],
      Status: [
        { dictValue: '0', dictLabel: '待发货' },
        { dictValue: '1', dictLabel: '已发货，待收货' },
        { dictValue: '2', dictLabel: '已收货，待评价' },
        { dictValue: '3', dictLabel: '已完成' },
      ],
      orderId: '',
      disa: false,
    }
  },
  created() {
    this.orderId = this.detailsrow.orderId
    this.getList()
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        this.orderId = newName.orderId
        this.getList()
      },
    },
  },
  methods: {
    getList() {
      var that = this
      that.form = {}
      if (that.orderId) {
        orderDetail(that.orderId).then((response) => {
          that.form = response.data
          that.Status.forEach((item) => {
            if (item.dictValue == that.form.orderStatus) {
              that.form.status = item.dictLabel
            }
          })
          if (that.form.orderStatus == '0') {
            that.disa = false
          } else {
            that.disa = true
          }
        })
      }
    },
    cancel() {
      this.loading = false
      this.open = false
      this.$parent.$parent.cancel()
    },
    querySearchs(queryString, cb) {
      var province = this.province
      var results = queryString
        ? province.filter(this.createFilter(queryString))
        : province
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect(item) {
      this.form.cityName = item.value
      this.form.bigareaId = item.bigareaId
      this.form.bigareaName = item.bigareaName
      this.form.cityId = item.cityId
      this.form.provinceId = item.provinceId
    },
    /** 提交按钮 */
    submitForm: function () {
      if (!this.form.cityName) {
        this.form.cityName = ''
        this.form.bigareaId = ''
        this.form.bigareaName = ''
        this.form.cityId = ''
        this.form.provinceId = ''
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateOrder(this.form).then((response) => {
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
            this.msgSuccess('修改成功')
          })
        }
      })
    },
  },
  mounted() {
    let invoiceAccountHistory = []
    getCityList().then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        let item = {
          value: response.data[i].cityName,
          cityId: response.data[i].cityId,
          bigareaId: response.data[i].bigareaId,
          bigareaName: response.data[i].bigareaName,
          provinceId: response.data[i].provinceId,
        }
        invoiceAccountHistory.push(item)
      }
      this.province = invoiceAccountHistory
    })
  },
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
