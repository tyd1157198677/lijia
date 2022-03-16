<template>
  <div class="app-container">
    <el-form
      class="formClass"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="勋章类型" prop="metalTypeId">
        <el-select
          @change="metalTypeSelectChange"
          v-model="queryParams.metalTypeId"
          placeholder="勋章类型"
          clearable
          size="mini"
        >
          <el-option
            v-for="dict in metalTyperow"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="勋章名称" prop="metalId">
        <el-select v-model="queryParams.metalId" placeholder="勋章名称" clearable size="mini">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.metalId"
            :label="dict.metalName"
            :value="dict.metalId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户名" clearable size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button plain type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="noticeList">
      <el-table-column
        label="勋章类型"
        align="center"
        prop="metalTypeName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="勋章名称" align="center" prop="metalName"/>
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
      <el-table-column label="勋章等级" align="center" prop="metalLevel"  />
      <el-table-column label="用户昵称" align="center" prop="nickeName"  />
      <el-table-column label="获得时间" align="center" prop="awardedTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.awardedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMetalAwarded, listMetalSelect } from '@/api/medal'
import { getType } from '@/api/system/dict/type'
import { listData } from '@/api/system/dict/data'

export default {
  name: 'Notice',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      metalTyperow: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        dictType: '',
        metalTypeId: '', //勋章类型dict_value
        metalId: '', //勋章id
        userId: '', //用户管理点击某个人获得勋章记录进入时必填
        nickName: '', //昵称
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    }
  },
  created() {
    this.getList()
    this.metalCondition()
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      listMetalAwarded(this.queryParams).then((response) => {
        console.log(response)
        this.noticeList = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },

    metalCondition() {
      getType(115).then((response) => {
        this.queryParams.dictType = response.data.dictType
        listData(this.queryParams).then((response) => {
          this.metalTyperow = response.rows
          let metalTypeId = {
            metalTypeId: '',
          }
          listMetalSelect(metalTypeId).then((response) => {
            console.log(response)
            this.typeOptions = response.data
          })
        }) 
      })
    },
    metalTypeSelectChange(value) {
      let metalTypeId = {
        metalTypeId: value,
      }
      listMetalSelect(metalTypeId).then((response) => {
        console.log(response)
        this.typeOptions = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
  },
}
</script>
<style scoped>
.userAvatar-imgs {
  width: 35px;
  height: 35px;
}
</style>