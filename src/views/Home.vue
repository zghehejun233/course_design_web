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
          <div
              class="home"
              style="
            margin-top: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
          >
            <el-button size="large" class="deleteButton" type="primary" @click="logout">退出登录</el-button>
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
          "http://localhost:9090/api/teach/printStudentIntroduce",
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

</style>