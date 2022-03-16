<template>
  <div class="app-details">
    <el-form ref="forms" :model="forms" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名/订购人：" prop="userName">
            <el-input v-model="forms.userName" placeholder="请输入姓名/订购人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订购人电话：" prop="mobile">
            <el-input v-model="forms.mobile" placeholder="请输入订购人电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整理服务：" prop="itemId">
            <el-select v-model="forms.itemId" placeholder="请选择整理服务" @change="handleitemName">
              <el-option
                v-for="dict in source"
                :key="dict.itemId"
                :label="dict.itemName"
                :value="dict.itemId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品价格：" prop="itemPrice">
            <el-input v-model="forms.itemPrice" placeholder="请输入商品价格" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人名称：" prop="recommendUsername">
            <el-input v-model="forms.recommendUsername" placeholder="请输入推荐人名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人电话：" prop="recommendMobile">
            <el-input v-model="forms.recommendMobile" placeholder="请输入推荐人电话" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="组织人名称：" prop="responsibleArrangeUserName">
            <el-input v-model="forms.responsibleArrangeUserName" placeholder="请输入组织人名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织人电话：" prop="responsibleArrangePhone">
            <el-input v-model="forms.responsibleArrangePhone" placeholder="请输入组织人电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务人员：" prop="distributeUsers">
            <el-input
              v-model="forms.distributeUsersuserName"
              @focus="distribute"
              placeholder="请输入服务人员"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市：" prop="cityName">
            <el-autocomplete
              class="inline-input"
              v-model="forms.cityName"
              :fetch-suggestions="querySearchs"
              placeholder="请选择城市"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="forms.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="大区：" prop="bigareaName">
            <el-input v-model="forms.bigareaName" placeholder="请输入大区" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态：" prop="payStatus">
            <el-select v-model="forms.payStatus" placeholder="请选择订单状态">
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
            <el-input v-model="forms.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancels">取 消</el-button>
    </div>
    <!-- 添加服务人员 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <div v-if="open">
        <el-row>
          <el-form :model="form" ref="queryForm" :inline="true">
            <el-form-item label="名称：" prop="userName">
              <el-input v-model="form.nickName" placeholder="请输入名称" clearable size="mini" />
            </el-form-item>
            <el-form-item label="手机号：" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入手机号" clearable size="mini" />
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
          <div class="xuanzhong">
            选中人员：
            <el-tag
              v-for="tag in ids"
              :key="tag.userId"
              closable
              @close="handleClose(tag)"
            >{{tag.userName}}</el-tag>
          </div>
          <el-table
            v-loading="loading"
            ref="distributeUsersrow"
            :data="distributeUsersrow"
            highlight-current-row
            @current-change="handleSelectionChange"
          >
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
              label="创建时间"
              align="center"
              key="createTime"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{scope.row.createTime.replace("T", " ")}}</span>
              </template>
            </el-table-column>
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
          <el-button type="primary" @click="submitdistribute">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCityList,
  saveOrder,
  updateOrder,
  getServiceItemList,
  getAllArrangeUserList,
  detailorder,
} from '@/api/middleground/order/service'
export default {
  name: 'addUser',
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
        pageSize: 10,
      },
      // 表单参数
      forms: {
        userName: '',
        mobile: '',
        itemId: '',
        itemName: '',
        itemPrice: '',
        cityId: '',
        provinceId: '',
        bigareaId: '',
        address: '',
        mobile: '',
        payStatus: '',
        recommendMobile: '',
        recommendUsername: '',
        remark: '',
        responsibleArrangePhone: '',
        responsibleArrangeUserName: '',
        distributeUsers: [],
        distributeUsersuserName: '',
      },
      form: {
        nickName: '',
        userMobile: '',
      },
      // 表单校验
      rules: {
        mobile: [
          { required: true, message: '订购人电话不能为空', trigger: 'blur' },
        ],
        responsibleArrangeUserName: [
          { required: true, message: '组织人名称不能为空', trigger: 'blur' },
        ],
        responsibleArrangePhone: [
          { required: true, message: '组织人电话不能为空', trigger: 'blur' },
        ],
        itemId: [
          { required: true, message: '整理服务不能为空', trigger: 'blur' },
        ],
      },
      province: [],
      source: [],
      distributeUsersrow: [],
      Status: [
        { dictValue: '1', dictLabel: '待支付' },
        { dictValue: '6', dictLabel: '线下付款已收款' },
      ],
    }
  },
  created() {
    this.queryParams = {
      pageNum: 1,
      pageSize: 10,
    }
    this.form = {
      nickName: '',
      userMobile: '',
    }
    this.getList()
    this.getAllArrangeUser()
    getServiceItemList().then((response) => {
      this.source = response.data
    })
  },
  watch: {},
  methods: {
    getList() {},
    getAllArrangeUser() {
      getAllArrangeUserList(this.queryParams, this.form).then((response) => {
        this.total = response.total
        this.distributeUsersrow = response.rows
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getAllArrangeUser()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.form = {
        nickName: '',
        userMobile: '',
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    responsibleArrange() {},
    distribute() {
      var that = this
      that.loading = false
      that.open = true
      that.title = '服务人员详情'
      that.resetQuery()
      that.ids = []
      that.forms.distributeUsersuserName = ''

      if (
        that.forms.distributeUsers != undefined &&
        that.forms.distributeUsers != null &&
        that.forms.distributeUsers != ''
      ) {
        that.forms.distributeUsers.forEach((row) => {
          that.ids.push(row)
          that.forms.distributeUsersuserName += row.userName + ' '
        })
      }
    },
    cancel() {
      this.forms.distributeUsersuserName = ''
      if (
        this.forms.distributeUsers != undefined &&
        this.forms.distributeUsers != null &&
        this.forms.distributeUsers != ''
      ) {
        this.forms.distributeUsers.forEach((row) => {
          this.forms.distributeUsersuserName += row.userName + ' '
        })
      }
      this.loading = false
      this.open = false
    },
    submitdistribute() {
      this.forms.distributeUsers = []
      if (this.ids != undefined && this.ids != null && this.ids != '') {
        this.ids.forEach((row) => {
          this.forms.distributeUsers.push(row)
        })
      }
      this.open = false
    },
    // 选框选中数据
    handleSelectionChange(val) {
      if (val != undefined && val != null && val != '') {
        if (this.ids.length == 0) {
          this.ids.push(val)
          this.forms.distributeUsersuserName += val.userName + ' '
        } else {
          var add = true
          for (var i = 0; i < this.ids.length; i++) {
            if (this.ids[i].userId == val.userId) {
              add = false
              return
            }
          }
          if (add) {
            this.ids.push(val)
            this.forms.distributeUsersuserName += val.userName + ' '
          }
        }
      }
    },
    handleClose(tag) {
      this.ids.splice(this.ids.indexOf(tag), 1)
      this.forms.distributeUsersuserName = ''
      this.ids.forEach((row) => {
        this.forms.distributeUsersuserName += row.userName + ' '
      })
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
    handleitemName(row) {
      this.source.forEach((item) => {
        if (item.itemId == row) {
          this.forms.itemId = item.itemId
          this.forms.itemName = item.itemName
          this.forms.itemPrice = item.price
        }
      })
    },
    handleSelect(item) {
      this.forms.cityName = item.value
      this.forms.bigareaId = item.bigareaId
      this.forms.bigareaName = item.bigareaName
      this.forms.cityId = item.cityId
      this.forms.provinceId = item.provinceId
    },
    /** 提交按钮 */
    submitForm: function () { 
      if (this.forms.distributeUsers != undefined) {
        this.forms.distributeUsers.forEach((item) => {
          var i = {
            arrangeUserId: item.userId,
            arrangeUserName: item.userName,
          }
          this.forms.distributeUsers.push(i)
        })
      }
      if (!this.forms.cityName) {
        this.forms.cityName = ''
        this.forms.bigareaId = ''
        this.forms.bigareaName = ''
        this.forms.cityId = ''
        this.forms.provinceId = ''
      }
      this.$refs['forms'].validate((valid) => {
        if (valid) {
          saveOrder(this.forms).then((response) => {
            this.$parent.$parent.cancels()
            this.$parent.$parent.getList()
            this.msgSuccess('保存成功')
          })
        }
      })
    },
    cancels() {
      this.forms.distributeUsersuserName = ''
      this.forms = {}
      this.resetForm('forms')
      this.$parent.$parent.cancels()
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
.xuanzhong {
  margin: 0 0 20px 0;
}
.xuanzhong span {
  margin-right: 5px;
}
</style>
