<template>
  <div class="navi" style="height: 100%">
    <div class="el-image">
      <el-image  src="https://gravatar.loli.net/avatar/c14402ce10441a645a6151118eef7609?d=retro&v=1.4.18" fit="contain"/>
    </div>
    <el-scrollbar height="500px">
      <div class="menu-title">
        Hello
      </div>
      <el-menu
          class="header"
          router
          active-text-color="#ffd04b"
          text-color="#303133"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          style="height: 100%;
font-size: 16px"
      >
        <el-menu-item index="/Home" class="menu-item"> 主页 </el-menu-item>
        <el-menu-item index="/studentIntroduce" class="menu-item"
        >个人简历</el-menu-item
        >
        <el-menu-item
            class="menu-item"
            v-for="(v, i) in list"
            :key="i"
            index="/resolver"
            @click="getTitle(v.title)"
        >{{ v.title }}
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Navi",
  components: {},
  computed: {
    ...mapState(["list"]),
  },
  data() {
    return {
      activeIndex: "/Home",
    };
  },
  methods: {
    getTitle(title) {
      this.$store.commit("setRouterName", title);
      this.$emit("title", title);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key,keyPath) {
      console.log(key,keyPath);
    }
  },
};
</script>

<style>

.el-image {
  padding: 20px;

}

.menu-title {
  font-size: 18px;
  font-weight: bolder;
  text-align: center;
  margin-bottom: 20px;
}

.menu-item {
  font-size: 16px;
}
</style>