<template>
  <div class="app-details">
    <el-form class="detatitle" ref="form" :model="form" label-width="140px" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号：">{{form.orderNumber}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名：">{{form.userName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户手机号：">{{form.mobile}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务名称：">{{form.itemName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单支付状态：">{{form.payStatusName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人姓名：">{{form.recommendUsername}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人手机号：">{{form.recommendMobile}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织人姓名：">{{form.responsibleArrangeUserName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织人电话：">{{form.responsibleArrangeMobile}}</el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="组织人id：">{{form.responsibleArrangeUserId}}</el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="折扣：">{{form.discount}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间：">{{form.createTime}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付时间：">{{form.payTime}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：">{{form.remark}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务人员集合">
            <span
              v-for="(dict, index) in form.distributeUsers"
              :key="index"
            >{{ dict.arrangeUserName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务上门时间">{{form.doorServiceTime}}</el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="下单人id：">{{form.userId}}</el-form-item>
        </el-col>-->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { detailorder } from '@/api/middleground/order/service'

export default {
  name: 'detail',
  props: ['detailsrow'],
  data() {
    return {
      //默认第一个选项卡
      activeName: 'curriculum',

      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 部门表格数据
      deptList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      orderId: '',
      Status: [
        { dictValue: '1', dictLabel: '待支付' },
        { dictValue: '6', dictLabel: '线下付款已收款' },
      ],
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
    /** 查询列表 */
    getList() {
      var that = this
      that.loading = true
      if(that.orderId){
      detailorder(that.orderId).then((response) => {
        that.form = response.data
        that.loading = false
        this.Status.forEach((dictValue, index) => {
          if (that.form.payStatus == dictValue.dictValue) {
            that.form.payStatus = dictValue.dictLabel
          }
        })
      })}
    },
  },
}
</script>
<style scoped>
.detatitle {
  margin-bottom: 20px;
}
.detatitle .el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
.userdetails {
  margin: 0 0px 0px 0;
}
.userdetails .el-tabs__nav-scroll {
  padding: 0 20px;
}
.el-dialog__body {
  padding: 20px 20px;
}
.tabZujian {
  background: #fff;
  margin: 20px;
  margin-bottom: 0;
}
</style>
