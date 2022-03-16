<template>
  <div class="tabZujian">
    <el-tabs v-model="activeName" class="userdetails">
      <el-tab-pane label="文章" name="publisharticles" :key="'publisharticles'">
        <publisharticles :userId="userId"></publisharticles>
      </el-tab-pane>
      <el-tab-pane label="点赞" name="thumbs" :key="'thumbs'">
        <thumbs :userId="userId"></thumbs>
      </el-tab-pane>
      <el-tab-pane label="收藏" name="collection" :key="'collection'">
        <collection :userId="userId"></collection>
      </el-tab-pane>
      <el-tab-pane label="关注" name="follow" :key="'follow'">
        <follow :userId="userId"></follow>
      </el-tab-pane>
      <el-tab-pane label="粉丝" name="fans" :key="'fans'">
        <fans :userId="userId"></fans>
      </el-tab-pane>
      <el-tab-pane label="勋章" name="medal" :key="'medal'">
        <medal :userId="userId"></medal>
      </el-tab-pane>
      <!-- <el-tab-pane label="黑名单" name="blacklist" :key="'blacklist'">
        <blacklist :userId="userId"></blacklist>
      </el-tab-pane> -->

    </el-tabs>
  </div>
</template>
<script>
import collection from "../collection";
import fans from "../fans";
import follow from "../follow";
import publisharticles from "../publisharticles";
import thumbs from "../thumbs";
import blacklist from "../blacklist"; 
export default {
  name: "userdetails",
  components: {
    collection,
    fans,
    follow,
    publisharticles,
    thumbs,
    blacklist
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: "publisharticles",
      userId: ""
    };
  },
  created() {
    const userId = this.$route.query.userId;
    this.userId = userId;
  },
  mounted() {}
};
</script>
<style>
.userdetails {
  margin: 0 0px;
}
.userdetails .el-tabs__nav-scroll {
  padding: 0 20px;
}

.tabZujian{
  background: #fff;
  margin:20px;
}
</style>
