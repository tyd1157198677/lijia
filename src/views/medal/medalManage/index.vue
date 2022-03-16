<template>
  <div class="tabZujian">
    <el-tabs v-model="activeName" class="userdetails" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item,index) in dataList"
        :key="item.dictValue"
        :label="item.dictLabel"
        :name="item.dictValue"
      >
        <detail :dictvalue="item.dictValue" v-if="detailrow[index]"></detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template> 
<script>
import detail from './details'
import { getType } from '@/api/system/dict/type'
import { listData } from '@/api/system/dict/data'
export default {
  name: 'medalManage',
  components: {
    detail,
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: '1',
      dict_value: '',
      detailrow: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        dictType: '',
      },
      dataList: [],
      // 默认勋章类型类型
      defaultDictType: '',
    }
  },
  created() {
    const dictId = 115
    this.getType(dictId)
  },
  methods: {
    /** 查询勋章类型类型详细 */
    getType(dictId) {
      getType(dictId).then((response) => {
        this.queryParams.dictType = response.data.dictType
        this.defaultDictType = response.data.dictType
        this.getList()
      })
    },
    /** 查询勋章类型数据列表 */
    getList() {
      this.loading = true
      listData(this.queryParams).then((response) => { 
        this.dataList = response.rows
        for (var i = 0; i < this.dataList.length; i++) {
          this.detailrow.push(false)
        }
        this.detailrow[0] = true 
        this.loading = false
      })
    },
    handleClick(tab, event) {
      var that = this 
      for (var i = 0; i < that.detailrow.length; i++) {
        that.detailrow[i] = false
      }
      that.detailrow[tab.index] = true
    },
  },
}
</script>
<style>
.userdetails {
  margin: 0 0px;
}
.userdetails .el-tabs__nav-scroll {
  padding: 0 20px;
}
.el-table{
  width: 100%;
  margin:0;
}
.tabZujian {
  background: #fff;
  margin: 20px;
}
</style>
