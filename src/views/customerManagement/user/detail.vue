<template>
  <div class="app-details">
    <el-form class="detatitle" ref="deptList" :model="form" label-width="100px" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名：">{{deptList.nickName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：">{{deptList.userMobile}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市：">{{deptList.cityName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最近下单：">{{deptList.lastOrderTime}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总消费：">{{deptList.totalMoney}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="tabZujian">
      <el-tabs v-model="activeName" class="userdetails">
        <el-tab-pane label="服务" name="service" :key="'service'">
          <service ref="service" :userId="userId"></service>
        </el-tab-pane>
        <el-tab-pane label="课程" name="curriculum" :key="'curriculum'">
          <curriculum ref="curriculum" :userId="userId"></curriculum>
        </el-tab-pane>
        <el-tab-pane label="收纳" name="receive" :key="'receive'">
          <receive ref="receive" :userId="userId"></receive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import curriculum from '@/views/components/management/curriculum'
import receive from '@/views/components/management/receive'
import service from '@/views/components/management/service'
import { getUser } from '@/api/middleground/customerManagement/user'

export default {
  name: 'detail',
  props: ['detailsrow'],
  components: {
    curriculum,
    receive,
    service,
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: 'service',

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
      userId: '',
    }
  },
  created() {
    this.userId = this.detailsrow.userId
    this.getList()
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        
        this.userId = newName.userId
        this.activeName = 'service'
        this.getList()
      },
    },
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      var that = this
      that.loading = true
      setTimeout(function () {
        that.$refs.curriculum.getListCourse()
        that.$refs.service.getListService()
        that.$refs.receive.getListgoods()
      }, 200)
      getUser(that.userId).then((response) => {
        that.deptList = response.data
        that.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
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
.userdetails {
  margin: 0 0px 0px 0;
}
.userdetails .el-tabs__nav-scroll {
  padding: 0 20px;
}

.tabZujian {
  background: #fff;
  margin: 20px;
  margin-bottom: 0;
}
</style>
