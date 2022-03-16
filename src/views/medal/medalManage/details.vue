<template>
  <div class="app-container">
    <div class="formClass">
      <el-row :gutter="10" class="mb16">
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="deptList">
      <el-table-column label="序号" align="center" prop="metalId" />
      <el-table-column label="勋章名称" align="center" prop="metalName" />
      <el-table-column label="默认图标" align="center" key="metalIcon" prop="metalIcon">
        <template slot-scope="scope" v-if="scope.row.metalIcon">
          <div class="userAvatar">
            <img :src="scope.row.metalIcon" class="userAvatar-imgs" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="条件" align="center" prop="metalConditionName" />
      <el-table-column label="授予总人数" align="center" prop="totalSum" />

      <el-table-column label="禁用" align="center" key="isDisabled">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isDisabled" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="promotionStartTime"
        width="180"
        v-if="metalTypeId==2"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.promotionStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="promotionEndTime"
        width="180"
        v-if="metalTypeId==2"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.promotionEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handlelookRank(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item
          label="勋章名称："
          prop="subMetal.metalName"
          :rules="{required: true, message: '请输入勋章名称', trigger: 'blur'}"
        >
          <el-input v-model="form.subMetal.metalName" placeholder="请输入勋章名称" />
        </el-form-item>
        <el-form-item
          label="默认图标："
          prop="subMetal.metalIcon"
          :rules="{required: true, message: '请添加默认图标', trigger: 'blur'}"
        >
          <ImageUpload :Image="form.subMetal.metalIcon" ref="metalIcon"></ImageUpload>
        </el-form-item>
        <el-form-item
          label="开始时间"
          v-if="metalTypeId==2"
          prop="subMetal.promotionStartTime"
          :rules="{required: true, message: '请选择开始时间', trigger: 'blur'}"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.subMetal.promotionStartTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          v-if="metalTypeId==2"
          prop="subMetal.promotionEndTime"
          :rules="{required: true, message: '请选择开始时间', trigger: 'blur'}"
        >
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.subMetal.promotionEndTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="条件："
          prop="subMetal.metalConditionId"
          :rules="{required: true, message: '请选择管理类型', trigger: 'change'}"
        >
          <el-select
            :disabled="subMetalLevel.length!=0"
            v-model="form.subMetal.metalConditionId"
            placeholder="请选择管理类型"
          >
            <el-option
              v-for="dict in metalConditionIdrow"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="等级：" prop="subMetal.subMetalLevel">
          <p class="level" v-for="(item,index) in subMetalLevel" :key="item.metalId">
            <span style="width:15%">Lv.{{item.metalLevel}}</span>
            <span>描述：{{item.metalLevelDescribe}}</span>
            <el-button type="text" icon="el-icon-edit" @click="editsubMetal(item,index)">修改</el-button>
          </p>
          <el-button
            :disabled="form.subMetal.metalConditionId==''"
            v-show="editaddsubMetal"
            style="width:40%"
            type="primary"
            @click="addsubMetal"
          >添加</el-button>
        </el-form-item>
        <el-form-item label="禁用">
          <el-switch v-model="form.subMetal.isDisabled"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="subMetalLevel.length!=0">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="addtitle" :visible.sync="addopen" width="35%">
      <el-form ref="addform" :model="addform" :rules="rules" label-width="120px">
        <el-form-item label="勋章等级：" prop="metalLevel">
          <el-input placeholder="请输入勋章等级" v-model="addform.metalLevel" readonly>
            <template slot="prepend">Lv.</template>
          </el-input>
        </el-form-item>
        <el-form-item label="勋章描述：" prop="metalLevelDescribe">
          <el-input
            type="textarea"
            autosize
            v-model="addform.metalLevelDescribe"
            placeholder="请输入勋章描述"
          />备注：用于在APP展示
        </el-form-item>
        <el-form-item label="默认图标：" prop="metalLevelDefaultIcon">
          <ImageUpload :Image="addform.metalLevelDefaultIcon" ref="metalLevelDefaultIcon"></ImageUpload>
        </el-form-item>
        <el-form-item label="点亮图标：" prop="metalLevelLightIcon">
          <ImageUpload :Image="addform.metalLevelLightIcon" ref="metalLevelLightIcon"></ImageUpload>
        </el-form-item>
        <el-form-item label="条件：" prop="metalLevelCondition">
          <el-input
            type="number"
            placeholder="请输入条件"
            v-model="addform.metalLevelCondition"
            @keyup.native="metalLevelConditionnumber"
          >
            <template slot="prepend">
              <span class="meta" v-for="(item) in metalConditionIdrow" :key="item.metalId">
                <span v-if="item.dictValue==form.subMetal.metalConditionId">
                  {{item.dictLabel}}
                  <el-select v-model="addform.decideSymbol" class="decidesymb">
                    <el-option label="≥" value="≥"></el-option>
                    <el-option label="=" value="="></el-option>
                  </el-select>
                </span>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="每日累计上限：" prop="metalLevelUpperLimit">
          <el-input
            type="number"
            v-model="addform.metalLevelUpperLimit"
            placeholder="请输入默认图标"
            @keyup.native="metalLevelUpperLimitnumber"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitaddForm" v-if="add">添 加</el-button>
        <el-button type="primary" @click="submiteditForm" v-if="!add">修 改</el-button>
        <el-button @click="editcancel" v-if="!add">返 回</el-button>
        <el-button @click="addcancel" v-if="add">返 回</el-button>
      </div>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      :title="listMetalLeveltitle"
      :visible.sync="listMetalLevelopen"
      width="45%"
      append-to-body
    >
      <div>
        <lookRank :detailsrow="detailsrow"></lookRank>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listmedal,
  addmetal,
  updatemetal,
  selectMetalDetail,
  updateDeleted,
  updateDisabled,
} from '@/api/medal'
import { getType } from '@/api/system/dict/type'
import { listData } from '@/api/system/dict/data'
import lookRank from '@/views/medal/medalManage/lookRank'
export default {
  name: 'detail',
  props: ['dictvalue'],
  components: {
    lookRank,
  },
  data() {
    var validate1 = (rule, value, callback) => {
      if (this.addform.metalLevel != 1) {
        if (
          parseFloat(
            this.subMetalLevel[this.addform.metalLevel - 2].metalLevelCondition
          ) >= value
        ) {
          callback(new Error('请重新输入条件,必须大于上一级条件个数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate2 = (rule, value, callback) => {
      if (parseFloat(this.addform.metalLevelCondition) <= value) {
        callback(
          new Error(
            '请重新输入每日累计上限,每一级的每日累计上限数值小于条件数值'
          )
        )
      } else {
        callback()
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 数据
      deptList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查看弹出层标题
      listMetalLeveltitle: '',
      // 查看是否显示弹出层
      listMetalLevelopen: false,
      detailsrow: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      }, // 查询参数
      queryParamss: {
        pageNum: 1,
        pageSize: 20,
        dictType: '',
      },
      // 表单提交
      form: {
        subMetal: {
          metalName: '',
          metalIcon: '',
          metalConditionId: '',
          metalTypeId: '',
          isDisabled: false,
        },
        subMetalLevel: [],
      },
      add: true,
      editindex: '',
      addform: {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: '',
        decideSymbol: '≥',
      },
      subMetalLevel: [],
      // 表单校验
      rules: {
        metalLevelDescribe: [
          { required: true, message: '勋章描述不能为空', trigger: 'blur' },
        ],
        metalLevelCondition: [
          { required: true, message: '勋章条件不能为空', trigger: 'blur' },
          { validator: validate1, trigger: 'blur' },
        ],
        metalLevelUpperLimit: [{ validator: validate2, trigger: 'blur' }],
        metalLevelDefaultIcon: [
          { required: true, message: '默认图标不能为空', trigger: 'blur' },
        ],
        metalLevelLightIcon: [
          { required: true, message: '点亮图标不能为空', trigger: 'blur' },
        ],
      },
      metalTypeId: '1',
      metalConditionIdrow: [],
      addtitle: '',
      addopen: false,
      editaddsubMetal: true,
    }
  },
  created() {
    this.getList()
    this.metalCondition()
  },
  watch: {
    dictvalue(val, oldVal) {
      this.metalTypeId = val
      this.getList()
    },
  },
  methods: {
    /** 查询列表 */
    getList() {
      var that = this
      that.loading = true
      this.metalTypeId = that.dictvalue
      let metalTypeId = that.dictvalue
      listmedal(this.queryParams, metalTypeId).then((response) => {
        that.deptList = response.data.rows
        that.total = response.data.total
        that.loading = false
      })
    },
    metalCondition() {
      getType(116).then((response) => {
        this.queryParamss.dictType = response.data.dictType
        listData(this.queryParamss).then((response) => {
          this.metalConditionIdrow = response.rows
        })
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.form = {
        subMetal: {
          metalName: '',
          metalIcon: '',
          metalConditionId: '',
          metalTypeId: '',
          isDisabled: false,
        },
        subMetalLevel: [],
      }
      this.addform = {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: '',
        decideSymbol: '≥',
      }
      this.subMetalLevel = []
      this.open = true
      this.editaddsubMetal = true
      this.title = '添加勋章'
    },

    // 查看
    handlelookRank(row) {
      ;(this.listMetalLeveltitle = '查看等级'),
        (this.listMetalLevelopen = true),
        (this.detailsrow = row)
    },
    handleStatusChange(row) {
      let text = row.isDisabled === false ? '启用' : '禁用'
      this.$confirm(
        '是否确认"' + text + '"id为"' + row.metalName + '"的勋章吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return updateDisabled(row.metalId, row.isDisabled)
        })
        .then(() => {
          this.getList()
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.isDisabled = row.isDisabled === false ? true : false
        })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      let metalId = row.metalId
      this.editaddsubMetal = false
      selectMetalDetail(metalId).then((response) => {
        this.form.subMetal = row
        this.form.subMetalLevel = response.data.list
        this.subMetalLevel = response.data.list
      })
      //
      this.open = true
      this.title = '修改勋章'
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const metalId = row.metalId
      this.$confirm('是否确认删除id为"' + metalId + '"的勋章吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return updateDeleted(metalId)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    },

    //修改等级
    editsubMetal(row, index) {
      this.addtitle = '修改等级'
      this.addopen = true
      this.add = false
      this.editindex = index
      this.addform = this.subMetalLevel[row.metalLevel - 1]
    },
    // 添加等级
    addsubMetal() {
      this.addopen = true
      this.addtitle = '添加等级'
      this.add = true
      this.addform = {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: this.subMetalLevel.length + 1,
        decideSymbol: '≥',
      }
    },
    submitForm: function () {
      console.log(this.subMetalLevel)
      this.form.subMetal.metalIcon =
        this.$refs.metalIcon.dialogImageUrl.split('.com')[1]
      this.form.subMetalLevel = this.subMetalLevel
      this.form.subMetal.metalTypeId = this.metalTypeId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.subMetal.metalIcon =
            this.$refs.metalIcon.dialogImageUrl.split('.com')[1]
          for (var i = 0; i < this.subMetalLevel.length; i++) {
            this.subMetalLevel[i].metalLevelDefaultIcon =
              this.subMetalLevel[i].metalLevelDefaultIcon.split('.com')[1]
            this.subMetalLevel[i].metalLevelLightIcon =
              this.subMetalLevel[i].metalLevelLightIcon.split('.com')[1]
          }
          if (this.form.subMetal.metalId != undefined) {
            updatemetal(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.editaddsubMetal = true
              this.getList()
              this.cancel()
            })
          } else {
            addmetal(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
              this.cancel()
            })
          }
        } else {
          this.form.subMetal.metalIcon = this.$refs.metalIcon.dialogImageUrl
        }
      })
    },
    // 取消按钮
    cancel() {
      this.form = {
        subMetal: {
          metalName: '',
          metalIcon: '',
          metalConditionId: '',
          metalTypeId: '',
          isDisabled: false,
        },
        subMetalLevel: [],
      }
      this.addform = {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: '',
        decideSymbol: '≥',
      }
      this.subMetalLevel = []
      this.$refs.form.resetFields()
      this.$refs.metalIcon.dialogImageUrl = ''
      this.open = false
      this.editaddsubMetal = true
      this.getList()
    },
    //等级添加
    submitaddForm: function () {
      this.addform.metalLevelDefaultIcon =
        this.$refs.metalLevelDefaultIcon.dialogImageUrl
      this.addform.metalLevelLightIcon =
        this.$refs.metalLevelLightIcon.dialogImageUrl
      if (!this.addform.metalLevelUpperLimit) {
        this.addform.metalLevelUpperLimit = 0
      }

      this.$refs['addform'].validate((valid) => {
        if (valid) {
          this.subMetalLevel.push(this.addform)
          this.addform = {
            metalLevelDescribe: '',
            metalLevelDefaultIcon: '',
            metalLevelCondition: '',
            metalLevelLightIcon: '',
            metalLevelUpperLimit: '',
            metalLevel: '',
            decideSymbol: '≥',
          }
          this.$refs.metalLevelDefaultIcon.dialogImageUrl = ''
          this.$refs.metalLevelLightIcon.dialogImageUrl = ''
          this.addopen = false
          this.add = true
          this.msgSuccess('添加成功')
        }
      })
    },

    //等级修改
    submiteditForm: function () {
      this.addform.metalLevelDefaultIcon =
        this.$refs.metalLevelDefaultIcon.dialogImageUrl
      this.addform.metalLevelLightIcon =
        this.$refs.metalLevelLightIcon.dialogImageUrl
      if (!this.addform.metalLevelUpperLimit) {
        this.addform.metalLevelUpperLimit = 0
      }
      this.$refs['addform'].validate((valid) => {
        if (valid) {
          this.subMetalLevel[this.editindex] = this.addform
          this.addform = {
            metalLevelDescribe: '',
            metalLevelDefaultIcon: '',
            metalLevelCondition: '',
            metalLevelLightIcon: '',
            metalLevelUpperLimit: '',
            metalLevel: '',
            decideSymbol: '≥',
          }
          this.$refs.metalLevelDefaultIcon.dialogImageUrl = ''
          this.$refs.metalLevelLightIcon.dialogImageUrl = ''
          this.addopen = false
          this.add = true
          this.editindex = ''
          this.msgSuccess('修改成功')
        }
      })
    },

    // 等级取消按钮
    addcancel() {
      this.addopen = false
      this.open = true
      this.$refs.metalLevelDefaultIcon.dialogImageUrl = ''
      this.$refs.metalLevelLightIcon.dialogImageUrl = ''
      this.addform = {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: '',
        decideSymbol: '≥',
      }
      this.resetForm('addform')
    },
    // 修改等级取消按钮
    editcancel() {
      this.addopen = false
      this.open = true
      this.$refs.metalLevelDefaultIcon.dialogImageUrl = ''
      this.$refs.metalLevelLightIcon.dialogImageUrl = ''
      this.addform = {
        metalLevelDescribe: '',
        metalLevelDefaultIcon: '',
        metalLevelCondition: '',
        metalLevelLightIcon: '',
        metalLevelUpperLimit: '',
        metalLevel: '',
        decideSymbol: '≥',
      }
    },
    metalLevelConditionnumber() {
      this.addform.metalLevelCondition =
        this.addform.metalLevelCondition.replace(/[^\.\d]/g, '')
      this.addform.metalLevelCondition = parseFloat(
        this.addform.metalLevelCondition.replace('.', '')
      )
    },
    metalLevelUpperLimitnumber() {
      this.addform.metalLevelUpperLimit =
        this.addform.metalLevelUpperLimit.replace(/[^\.\d]/g, '')
      this.addform.metalLevelUpperLimit = parseFloat(
        this.addform.metalLevelUpperLimit.replace('.', '')
      )
    },
  },
}
</script>
<style scoped>
.app-container {
  margin-top: 0;
}
.userAvatar-imgs {
  width: 50px;
  height: 50px;
}
.level {
  margin: 0 0px 10px 0;
}
.level span {
  display: block;
  margin-right: 20px;
  width: 30%;
  float: left;
  height: 36px;
  overflow: hidden;
}
.decidesymb {
  width: 75px;
  height: 36px;
  margin-top: -8px;
  margin-left: 10px;
  border: 1px solid #dee5ed;
  background: #fff;
}
</style>
