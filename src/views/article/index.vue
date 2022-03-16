<template>
  <div class="tabZujian">
    <el-tabs v-model="activeName" class="userdetails" @tab-click="handleClick">
      <el-tab-pane label="文章" ref="articles" name="articles" :key="'articles'">
        <articles v-if="isChildUpdate1"></articles>
      </el-tab-pane>
      <el-tab-pane label="待审核" ref="reviewed" name="reviewed" :key="'reviewed'">
        <reviewed v-if="isChildUpdate2"></reviewed>
      </el-tab-pane>
      <el-tab-pane label="未通过" ref="noadopt" name="noadopt" :key="'noadopt'">
        <noadopt v-if="isChildUpdate3"></noadopt>
      </el-tab-pane>
      <!-- <el-tab-pane label="推荐文章" name="recommend" :key="'recommend'">
                <recommend></recommend>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import articles from './articles'
import reviewed from './reviewed'
import noadopt from './noadopt'
// import recommend from './recommend'
export default {
  name: 'userdetails',
  components: {
    articles,
    reviewed,
    noadopt,
    // recommend
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: 'articles',
      phonenumber: '',
      isChildUpdate1: true,
      isChildUpdate2: false,
      isChildUpdate3: false,
    }
  },
  created() {
    const phonenumber = this.$route.query.phonenumber
    this.phonenumber = phonenumber
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      var that = this
      if (tab.index == '0') {
        that.isChildUpdate1 = true;
        that.isChildUpdate2 = false;
        that.isChildUpdate3 = false;
      } else if (tab.index == '1') {
        that.isChildUpdate1 = false;
        that.isChildUpdate2 = true;
        that.isChildUpdate3 = false;
      } else if (tab.index == '2') {
        that.isChildUpdate1 = false;
        that.isChildUpdate2 = false;
        that.isChildUpdate3 = true;
      }
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
.tabZujian {
  background: #fff;
  margin: 20px;
}
</style>
