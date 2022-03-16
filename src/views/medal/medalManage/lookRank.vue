<template>
  <div class="app-details">
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="等级勋章id" align="center" prop="metalLevelId" />
      <el-table-column label="等级" align="center" prop="metalLevel" />
      <el-table-column label="等级勋章描述" align="center" prop="metalLevelDescribe" />
      <el-table-column
        label="默认图标"
        align="center"
        key="metalLevelDefaultIcon"
        prop="metalLevelDefaultIcon"
      >
        <template slot-scope="scope" v-if="scope.row.metalLevelDefaultIcon">
          <div class="userAvatar">
            <img :src="scope.row.metalLevelDefaultIcon" class="userAvatar-imgs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="点亮图标"
        align="center"
        key="metalLevelLightIcon"
        prop="metalLevelLightIcon"
      >
        <template slot-scope="scope" v-if="scope.row.metalLevelLightIcon">
          <div class="userAvatar">
            <img :src="scope.row.metalLevelLightIcon" class="userAvatar-imgs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="升级条件" align="center" prop="metalLevelCondition" />
<el-table-column label="授予人数" align="center" prop="sum" />

      <el-table-column label="每日累计上限" align="center" prop="metalLevelUpperLimit" />
      <el-table-column
        label="授予人数详情"
        align="center"
        prop="sum"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handlelookRank(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-table :data="form">
        <el-table-column label="昵称" align="center" prop="nickName" />
        <el-table-column label="手机号" align="center" prop="mobile" />

        <el-table-column label="头像" align="center" key="userAvatar" prop="userAvatar">
          <template slot-scope="scope" v-if="scope.row.userAvatar">
            <div class="userAvatar">
              <img :src="scope.row.userAvatar" class="userAvatar-img" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="metalLevelfun"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listMetalLevel, listMetalUser } from '@/api/medal'

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
      form: [],
      // 表单校验
      rules: {},
      sun: [],
      metalLevelId: '',
    }
  },
  created() {
    this.getList()
  },
  watch: {
    detailsrow: {
      handler(newName, oldName) {
        this.getList()
      },
    },
  },
  methods: {
    /** 查询列表 */
    getList() {
      var that = this
      that.loading = true
      let metalId = that.detailsrow.metalId
      listMetalLevel(metalId).then((response) => {
        that.deptList = response.data.rows
        that.loading = false
      })
    },
    handlelookRank(row) {
      this.open = true
      this.title = '查看人员'
      this.metalLevelId = row.metalLevelId
      this.metalLevelfun()
    },
    metalLevelfun() { 
      listMetalUser(this.queryParams, this.metalLevelId).then((response) => {
        console.log(response)
        this.form = response.data.rows
        this.total = response.data.total 
      })
    },
  },
}
</script>
<style scoped>
.userAvatar-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.userAvatar-imgs {
  width: 35px;
  height: 35px;
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
