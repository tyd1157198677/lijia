<template>
  <div class="app-details">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="讲师名称：" prop="teacherName">
            <el-input v-model="form.teacherName" placeholder="请输入讲师名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理类型：" prop="typeName">
            <el-select v-model="form.typeName" placeholder="请选择管理类型">
              <el-option
                v-for="dict in type"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
        <el-col :span="24">
          <el-form-item label="自我介绍：" prop="introduce">
            <el-input v-model="form.introduce" placeholder="请输入自我介绍" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传图片：" prop="avatar">
            <!-- <el-input v-model="form.avatar" placeholder="请输入上传图片" /> -->
            <ImageUpload :Image="form.avatar" ref="ImageUpload"></ImageUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24"></el-col>
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
  addTeacher,
  getCityList,
} from '@/api/middleground/crm/lecturer'
export default {
  name: 'addUser',
  props: ['detailsrow'],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      // 表单参数
      form: {
        avatar: '',
        bigareaId: '',
        bigareaName: '',
        cityId: '',
        cityName: '',
        introduce: '',
        provinceId: '',
        teacherId: '',
        teacherName: '',
        type: '',
        typeName: '',
      },
      // 表单校验
      rules: {
        teacherName: [
          { required: true, message: '讲师名称不能为空', trigger: 'blur' },
        ],
      },
      province: [],
      type: [],
    }
  },
  created() {
    getDicts('dic_course_teacher_type').then((response) => {
      this.type = response.data
    })
    this.getList()
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        this.detailsrow = newName
        
        this.getList()
      },
    },
  },
  methods: {
    getList() {
     
      if (this.detailsrow.teacherId != undefined) {
        this.form = {
          avatar: this.detailsrow.avatar,
          bigareaId: this.detailsrow.bigareaId,
          bigareaName: this.detailsrow.bigareaName,
          cityId: this.detailsrow.cityId,
          cityName: this.detailsrow.cityName,
          introduce: this.detailsrow.introduce,
          provinceId: this.detailsrow.provinceId,
          teacherId: this.detailsrow.teacherId,
          teacherName: this.detailsrow.teacherName,
          type: this.detailsrow.type,
        }
        getDicts('dic_course_teacher_type').then((response) => {
          this.type = response.data 
          for (var i = 0; i < this.type.length; i++) {
            if (this.type[i].dictValue == this.detailsrow.type) {
              this.form.typeName = this.type[i].dictLabel
            }
          }
        })
      } else {
        this.form = {
          avatar: '',
          bigareaId: '',
          bigareaName: '',
          cityId: '',
          cityName: '',
          introduce: '',
          provinceId: '',
          teacherId: '',
          teacherName: '',
          type: '',
          typeName: '',
        }
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
      this.form.cityName = item.value
      this.form.bigareaId = item.bigareaId
      this.form.bigareaName = item.bigareaName
      this.form.cityId = item.cityId
      this.form.provinceId = item.provinceId
    },
    /** 提交按钮 */
    submitForm: function () {
      for (var i = 0; i < this.type.length; i++) {
        if (this.type[i].dictValue == this.form.typeName) {
          this.form.type = this.type[i].dictValue
          this.form.typeName = this.type[i].dictLabel
        }
      }
      if (!this.form.cityName) {
        this.form.cityName = ''
        this.form.bigareaId = ''
        this.form.bigareaName = ''
        this.form.cityId = ''
        this.form.provinceId = ''
      }

      let msg = '添加成功'
      if (this.form.teacherId) {
        msg = '修改成功'
      } else {
        msg = '添加成功'
      }
      console.log(this.$refs.ImageUpload.dialogImageUrl.split('.com')[0])
      if (
        this.$refs.ImageUpload.dialogImageUrl.split('.com')[0] ==
        'http://image.lijiazhengli'
      ) {
        this.form.avatar = this.$refs.ImageUpload.dialogImageUrl
      } else {
        this.form.avatar =
          this.$refs.ImageUpload.dialogImageUrl.split('.com')[1]
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addTeacher(this.form).then((response) => {
            this.msgSuccess(msg)
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
