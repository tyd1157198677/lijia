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
          <el-form-item label="电话：" prop="userMobile">
            <el-input  v-model="form.userMobile" placeholder="请输入电话" />
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
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址：" prop="userAddress">
            <el-input v-model="form.userAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="大区：" prop="bigareaName">
            <el-input v-model="form.bigareaName" placeholder="请输入大区" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="商品：" prop="goodsName">
            <el-input v-model="form.goodsName" @focus="goodsfocus" placeholder="请选择商品" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="商品数量：" prop="goodsNum">
            <el-input type="number" v-model="form.goodsNum" placeholder="请选择商品数量" />
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="推荐人名称：" prop="recommendUsername">
            <el-input v-model="form.recommendUsername" placeholder="请选择推荐人名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推荐人电话：" prop="recommendMobile">
            <el-input  v-model="form.recommendMobile" placeholder="请选择推荐人电话" />
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
        <el-col :span="12">
          <el-form-item label="配送单状态：" prop="status">
            <el-select v-model="form.status" placeholder="请选择配送单状态">
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
          <el-form-item label="快递名称：" prop="expressId">
            <el-select v-model="form.expressId" placeholder="请选择快递名称">
              <el-option v-for="dict in expres" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快递单号：" prop="expressNo">
            <el-input v-model="form.expressNo" placeholder="请输入快递单号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <!-- 课程列表 -->
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <div>
        <el-row>
          <el-table
            v-loading="loading"
            ref="goods"
            :data="goods"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="商品id"
              align="center"
              key="goodsId"
              prop="goodsId"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="商品名称"
              align="center"
              key="goodsName"
              prop="goodsName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="单位"
              align="center"
              key="unitName"
              prop="unitName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="商品成本价"
              align="center"
              key="costPrice"
              prop="costPrice"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="商品会员价"
              align="center"
              key="goodsPrice"
              prop="goodsPrice"
              :show-overflow-tooltip="true"
            />
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-row>
        <div slot="footer" class="dialog-footer footert">
          <el-button type="primary" @click="submitgoods">确 定</el-button>
          <el-button @click="cancelgoods">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveOrder,
  getGoodList,
  goodsExpress,
  getCityList,
} from '@/api/middleground/order/commodity'
export default {
  name: 'addUser',
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
      forms: {
        goodsName: '',
      },
      // 表单校验
      rules: {
        userMobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
        ],
        goodsName: [
          { required: true, message: '商品不能为空', trigger: 'blur' },
        ],
      },
      province: [],
      goods: [],
      expres: [],
      Status: [
        { dictValue: '1', dictLabel: '待支付' },
        { dictValue: '2', dictLabel: '已支付' },
        { dictValue: '3', dictLabel: '已发货' },
        { dictValue: '4', dictLabel: '已完成' },
      ],
    }
  },
  created() {
    this.getList()
    goodsExpress().then((response) => {
      this.expres = response.data
    })
  },
  watch: {},
  methods: {
    getList() {
      getGoodList(this.queryParams, this.forms).then((response) => {
        this.goods = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    cancel() {
      this.loading = false
       this.form = {}
      this.resetForm('form')
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
    goodsfocus() {
      let that = this
      that.open = true
      that.title = '课程列表接口'
    },
    submitgoods() {
      this.form.goodsId = this.currentRow.goodsId
      this.form.goodsName = this.currentRow.goodsName
      this.form.goodsNum = '1'
      this.open = false
    },
    cancelgoods() {
      this.open = false
    },
    handleCurrentChange(val) {
      this.currentRow = val
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
          saveOrder(this.form).then((response) => {
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
            this.msgSuccess('保存成功')
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
