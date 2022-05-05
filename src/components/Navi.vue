<template>
  <div class="navi" style="height: 100%">
    <el-menu
      class="header"
      router
      active-text-color="#ffd04b"
      background-color="#ecf5ff"
      text-color="#303133"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      style="height: 100%"
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