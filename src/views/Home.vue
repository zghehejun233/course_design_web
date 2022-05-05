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
                <el-button class="button" type="text" >Operation button</el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item"  style="font-size: 14px">{{ 'List item ' + o }}</div>
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
  width: 720px;
  height: 960px;
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