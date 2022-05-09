<template>
    <el-container class="el-container" style="height: 100%;width: 100%">
      <el-aside width="200px">
        <Navi/>
      </el-aside>
      <el-container>
        <el-header style="height: 60px;background-color: #409EFF; padding: 15px;text-align: center; border-radius: 2px">
          <div style="font-size: 24px;color: white;letter-spacing: 6px;font-family: 'PingFang SC',serif">学生管理系统</div>
        </el-header>
        <el-main>
          <div class="home">
            <el-card class="box-card">
              <div class="card-header">
                <span>项目简介</span>
              </div>
              <div  class="text item"  style="font-size: 14px">
                真的不知道该写啥了这里<br>
                本来应该有点内容的<br>
                写点总结啦简介啥的<br>
                但是我麻了<br>
                大概意思就是这么个意思<br>
                摆烂鸟<br>
                <div align="right">2022.5.9</div>
              </div>
              <div class="card-header">
                <span>致谢</span>
              </div>
              <div  class="text item"  style="font-size: 14px">
                再次感谢所有帮助过本项目的同学和资料作者<br>
                包括但不限于<br>
                zsb lsp zwn<br>
                whc lhs ljc<br>
                ...<br>
                所有资料及引用保存在<a href="http://47.100.74.245/blog/posts/22597/">个人博客</a><br>
                项目托管在<a href="https://github.com/zghehejun233/518_java_course_design">Github</a>，Gitee作为备份
              </div>
            </el-card>
          </div>
          <div
              class="home">
            <el-button size="large" class="button" type="primary" @click="logout">退出登录</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import Navi from "@/components/Navi";
import router from "@/router/index.js";
import {downloadPost} from "@/service/genServ.js";

export default {
  name: "Home",
  components: {
    Navi,
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      router.push("/login");
    },
    downPDF() {
      downloadPost(
          "http://47.100.74.245/api/teach/printStudentIntroduce",
          "个人简历"
      );
    },
  },
};
</script>
<style>
html {
  height: 100%;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  padding: 12px;
  width: 720px;
  height: 480px;
}

.home {
  margin-top: 50px;
  justify-content: center;
  display: flex;
}

.button {
height: 24px;
}
</style>