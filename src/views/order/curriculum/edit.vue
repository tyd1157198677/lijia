<template>
  <div class="app-details">
    <el-form ref="form" label-width="120px" >
      <el-row>
        <el-col :span="20">
          <el-form-item label="备注：" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.remark"
              placeholder="请输入备注"
            />
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
import { updateOrder } from '@/api/middleground/order/curriculum'

export default {
  name: 'editUser',
  props: ['detailsrow'],
  data() {
    return {
      // 表单参数
      form: {
        userId:"",
        remark: '',
      },
      // 表单校验
      rules: {},
    }
  },
  created() {
    this.getList()
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        this.form=newName
        this.getList()
      },
    },
  },
  methods: {
    getList() {
      this.form = this.detailsrow
    },
    cancel() {
      this.form =  {
        userId:"",
        remark: '',
      }
      this.resetForm('form')
      this.$parent.$parent.cancel()
    },
    /** 提交按钮 */
    submitForm: function () { 
          updateOrder(this.form).then((response) => {
            this.msgSuccess('修改成功')
            this.$parent.$parent.cancel()
            this.$parent.$parent.getList()
          })
     
     
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
</style>
