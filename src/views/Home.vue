<template>
  <div class="el-container">
  <el-row>
    <div>
    </div>
  </el-row>
    <el-row style="height: 100%;width:100%">
      <el-col style="height: 100%;width:100%" :span="4">
        <Navi />
      </el-col>
      <el-col style="height: 100%;width:100%" :span="20">
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
          <el-button size="primary" class="deleteButton" @click="logout()"
            >退出登录
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Navi from "@/components/Navi";
import router from "@/router/index.js";
import { downloadPost } from "@/service/genServ.js";

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

.el-container {
  height: 100%;
  width: 100%;
}
</style>