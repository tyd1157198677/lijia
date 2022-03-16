<template>
  <div class="app-details">
    <el-form ref="forms" :model="forms" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="nickName">
            <el-input v-model="forms.nickName" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：" prop="userMobile">
            <el-input  v-model="forms.userMobile" placeholder="请输入手机号" readonly />
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
          <el-form-item label="大区：" prop="bigareaName">
            <el-input v-model="forms.bigareaName" placeholder="请输入大区" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总单量：" prop="sumNum">
            <el-input  type="number" v-model="forms.sumNum" placeholder="请输入总单量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础单量：" prop="baseNum">
            <el-input  type="number" v-model="forms.baseNum" placeholder="请输入基础单量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合伙人类型：" prop="partnerLevelName">
            <el-input v-model="forms.partnerLevelName" placeholder="请选择合伙人类型" readonly />
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
import { getDicts, editUser, getCityList } from '@/api/middleground/crm/partner'

export default {
  name: 'editUser',
  props: ['detailsrow'],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      forms: {
        baseNum: '',
        bigareaId: '',
        cityId: '',
        nickName: '',
        provinceId: '',
        sumNum: '',
        userId: '',
        partnerLevel: '',
      },
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
        ],
        userMobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
        ],
      },
      province: [],
      source: [],
      itemNamerow: { itemName: '' },
    }
  },
  created() {
    this.getList()
    getDicts('dic_partner_level').then((response) => {
      this.source = response.data
    })
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        this.getList()
      },
    },
  },
  methods: {
    getList() {
      this.forms = {
        baseNum: this.detailsrow.baseNum,
        bigareaId: this.detailsrow.bigareaId,
        cityId: this.detailsrow.cityId,
        cityName: this.detailsrow.cityName,
        bigareaName: this.detailsrow.bigareaName,
        nickName: this.detailsrow.nickName,
        provinceId: this.detailsrow.provinceId,
        sumNum: this.detailsrow.sumNum,
        userId: this.detailsrow.userId,
        userMobile: this.detailsrow.userMobile,
        partnerLevel: this.detailsrow.partnerLevel,
        partnerLevelName: this.detailsrow.partnerLevelName,
      }
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
      this.forms.cityName = item.value
      this.forms.bigareaId = item.bigareaId
      this.forms.bigareaName = item.bigareaName
      this.forms.cityId = item.cityId
      this.forms.provinceId = item.provinceId
    },
    /** 提交按钮 */
    submitForm: function () {
      if (!this.forms.cityName) {
        this.forms.cityName = ''
        this.forms.bigareaId = ''
        this.forms.bigareaName = ''
        this.forms.cityId = ''
        this.forms.provinceId = ''
      }
      this.$refs['forms'].validate((valid) => {
        if (valid) {
          editUser(this.forms).then((response) => {
            this.msgSuccess('修改成功')
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
          })
        }
      })
    },
    cancels() {
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
