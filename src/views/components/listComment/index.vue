<template>
  <div class="app-container">
    <ul class="list commentul">
      <li
        class="item clearfix commentli"
        v-for="item in deptList"
        :key="item.commentId"
      >
        <img class="commentimg" :src="item.userAvatar" />
        <div class="commentdiv">
          <h3 class="commenth3">{{ item.nickName }}</h3>
          <div class="commenttxt">
            <p>
              <span>时间：{{ item.createTime }} </span>
            </p>
            <p>
              <span>内容:{{ item.content }}</span>
            </p>
          </div>
        </div>
        <div class="time fr ">
           <el-button size="mini" type="primary"    style="background-color:red;border-color:red;"  @click="deleteComment(item)" 
            >删除</el-button
          >
        </div>
        <div class="banner fr commdel">
             <el-button size="mini" type="primary" @click="handisbanner(item)" >
                <span v-if="!item.issuper">设为优质评论</span>
              <span v-if="item.issuper">取消优质评论</span>
            </el-button>
        
         
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  listCommentStores,
  updateByCommentId,
  deleteByCommentId
} from "@/api/system/article/publisharticles";

export default {
  name: "listComment",
  props: ["listCommentrow"],
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
      issupper: "2"
    };
  },
  watch: {
    listCommentrow: {
      handler(newName, oldName) {
        this.getComment();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /** 查询评论 */
    getComment() {
      var _this=this;
      _this.loading = true; 
      _this.articleId = _this.listCommentrow.articleId;
      listCommentStores(_this.articleId, _this.issupper).then(response => {
        if (response.data.total != "0") {
          _this.deptList = response.data.rows;  
          _this.total = response.data.total;
        } else {
          _this.deptList =[];
          _this.total = 0;
        } 
        _this.loading = false;
      });
    },
    handisbanner(row) { 
      let text = row.issuper === 0 ? "优质" : "取消优质";
      this.$confirm('确认要"' + text + '"这条评价吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
             let issuper = row.issuper === 0 ? 1 : 0; 
          return updateByCommentId(row.commentId,issuper);
        })
        .then(() => {
          this.getComment();
          this.msgSuccess(text + "成功");
        });
    },
    deleteComment(row) {
     var _this=this;
      _this.$confirm('确认要删除"' + row.nickName + '"的评论吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteByCommentId(_this.articleId, row.commentId);
        })
        .then(() => {
          _this.getComment();
          _this.msgSuccess("删除成功");
        });
    },
    // 取消按钮
    cancel() {
      _this.open = false;
      _this.reset();
    }
  }
};
</script>
<style>
 .dialogWh .el-dialog{
  width:700px;
 }
.commentul {
  margin: 0px;
  padding: 0;
}
.commentli {
  list-style: none;
  margin-bottom: 20px;
}
.commentimg {
  width: 30px;
  height: 30px;
  float: left;
  overflow: hidden;
  background: #ccc;
  border-radius: 50%;
}
.commentdiv {
  float: left;
  margin-left: 20px;
  width: 52%;
}
.commenth3 {
  padding: 0;
  margin: 0;
}
.commdel {
  text-align: center;
  margin-right: 50px;
}

.commenttxt p {
  margin: 0;
  padding: 0;
}
</style>
