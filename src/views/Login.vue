<template>
  <div class="login-container">
    <div class="title">student-info-client</div>
    <el-card style="width: 320px; height: 360px">
      <el-form class="login-form" autocomplete="on" label-position="left">
        <el-input
          class="input"
          ref="username"
          v-model="username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          size="large"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <user />
            </el-icon>
          </template>
        </el-input>
        <el-input
          class="input"
          v-model="password"
          type="password"
          placeholder="Password"
          name="password"
          size="large"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <key />
            </el-icon>
          </template>
        </el-input>
      </el-form>

      <el-button size="large" type="primary" @click="handleSubmit"
        >登录
      </el-button>
    </el-card>
  </div>
    <div id="app">
      <vue-particles color="#dedede"></vue-particles>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  created() {
    this.$store.commit("logout");
  },
  methods: {
    handleSubmit() {
      const { username, password } = this;
      if (username && password) {
        this.$store
          .dispatch("login", {
            username: username,
            password: password,
          })
          .catch(() => {
            this.$message({
              message: " 用户名或密码错误",
              type: "warnning",
            });
          });
      }
    },
  },
};
</script>

<style>
.login-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  background-color: #f4f9fe;
}
.title {
  margin-top: 92px;
  margin-bottom: 52px;
  font-size: 28px;
}

.login-form {
  padding: 24px;
}

.input {
  height: 36px;
  margin-bottom: 12px;
}
</style>

