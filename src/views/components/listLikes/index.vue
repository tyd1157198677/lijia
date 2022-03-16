<template>
  <div class="app-container"> 
   
  <el-table v-loading="loading" :data="deptList"  >   
        <el-table-column label="头像"
                           align="center"
                           key="userAvatar"
                           prop="userAvatar">
            <template slot-scope="scope">
              <img v-if="scope.row.userAvatar"
                   :src="scope.row.userAvatar"
                   class="userAvatar-imgs" />
              <img v-if="!scope.row.userAvatar"
                   src="https:/oss-img.lijiazhengli.com/img/touxiang.png"
                   class="userAvatar-imgs" />
            </template>
          </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="手机号" align="center" prop="userMobile" />  
      <el-table-column label="时间"
                           align="center"
                           key="createTime"
                           width="180">
            <template slot-scope="scope">
              <span >{{ scope.row.createTime}}</span>
            </template>
          </el-table-column>
 
    </el-table>
    
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      
    />  -->
  </div>
</template>

<script>
import { listLikesStores } from "@/api/system/article/publisharticles";

export default {
  name: "listLikes",
  props: ["listLikesrow"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 部门表格数据
      deptList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      articleId: "0",
    
    };
  }, 
watch:{ 
  listLikesrow: {
      handler(newName, oldName) { 
      this.getLikes()
    },
    deep: true,
    immediate: true
  }
},
  methods: {
    /** 查询文章点赞 */
    getLikes() {
      this.loading = true;   
      this.articleId=this.listLikesrow.articleId;
      listLikesStores(this.articleId).then(
        response => {
          if(response.data.total!="0"){
          this.deptList = response.data.rows; 
          this.total = response.data.total; 
          }else{ 
             this.deptList=[];
           this.total = 0;
          }
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
  }
};
</script>
<style scoped>
 
.el-dialog{
  min-width: 600px;
}
.htmldep img{
  width:100% !important;
}
.userAvatar-imgs{
  width: 30px;
  height:30px;
}
.htmldeps p{
    padding-top: 10px;
  border-top:5px solid #3676F5;
}
.htmldeps img{
  width: 280px;;
}
</style>
