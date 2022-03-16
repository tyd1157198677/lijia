<template>
  <div class="app-details">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：" prop="userMobile">
            <el-input   v-model="form.userMobile" placeholder="请输入手机号" />
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
          <el-form-item label="大区：" prop="bigareaName">
            <el-input v-model="form.bigareaName" placeholder="请输入大区" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="折扣" prop="discount">
            <el-select v-model="form.discount" placeholder="请输入折扣">
              <el-option
                v-for="dict in discountrow"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="客户来源：" prop="customerSource">
            <el-select v-model="form.customerSource" placeholder="请选择客户来源">
              <el-option
                v-for="dict in source"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户状态：" prop="userIntention">
            <el-select v-model="form.userIntention" placeholder="请选择客户状态">
              <el-option
                v-for="dict in intention"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户级别：" prop="userLevel">
            <el-select v-model="form.userLevel" placeholder="请输入客户级别">
              <el-option
                v-for="dict in level"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancels">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getDicts,
  addUser,
  getCityList,
} from '@/api/middleground/customerManagement/user'

export default {
  name: 'addUser',
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userMobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
        ],
      },
      province: [],
      source: [],
      level: [],
      intention: [],
      discountrow: [
        { dictValue: 1, dictLabel: 1 },
      ],
    }
  },
  created() {
    //dic_customer_source：客户来源；dic_user_level：用户级别；dic_user_intention用户意向
    getDicts('dic_customer_source').then((response) => {
      this.source = response.data
    })
    getDicts('dic_user_level').then((response) => {
      this.level = response.data
    })
    getDicts('dic_user_intention').then((response) => {
      this.intention = response.data
    })
  },
  methods: {
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
          addUser(this.form).then((response) => {
            this.msgSuccess('添加成功')
            this.resetForm('form')
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
          })
        }
      })
    },
    cancels() {
      this.form={}
      this.resetForm('form')
      this.$parent.$parent.cancel()
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
</style>
