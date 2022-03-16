<template>
  <div class="app-details">
    <el-form class="detatitle" ref="form" :model="form" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名：">{{form.nickName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：">{{form.userMobile}}</el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="大区：">{{form.bigareaName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市：">{{form.cityName}}</el-form-item>
        </el-col>
        
        <el-col :span="8">
        </el-col>
      </el-row>
    </el-form>
    <div class="app-details">
    <el-form class="formClass" :model="forms" ref="queryForms" :inline="true">
      <el-form-item label="项目名称：">
        <el-input v-model="itemNamerow.itemName" placeholder="请输入项目名称" clearable size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini"  @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
      <el-table v-loading="loading" :data="deptList">
        <el-table-column label="订单编号" align="center" prop="orderNumber" />
        <el-table-column label="项目名称" align="center" prop="itemName" />
        <el-table-column label="订单金额" align="center" prop="orderAmount" />
        <el-table-column label="组织人" align="center" prop="responsibleArrangeUserName" />
        <el-table-column label="参与人员" align="center" prop="arrangeUserName" />
        <el-table-column label="创建时间" align="center" key="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime}}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getArrange, getCourseOrder } from '@/api/middleground/crm/arrange'

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
        pageSize: 10,
      },
      // 表单参数
      form: {}, 
      forms: {},
      // 表单校验
      rules: {},
      userId: '',
      itemNamerow:{itemName:""},
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
        this.getList() 
      },
    },
  },
  methods: {
    /** 查询列表 */
    getList() {
      var that = this
      that.loading = true 
      getArrange(that.userId).then((response) => {  
        that.form = response.data 
        getCourseOrder(that.queryParams,that.userId,that.itemNamerow).then((response) => {
        that.deptList = response.rows
        that.total = response.total
        that.loading = false
      })
      })
    },    
    handleQuery(){
      this.queryParams.pageNum = 1
      this.getList()
    }
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
