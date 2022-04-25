<template>
  <div class="navi">
    <el-menu class="header" mode="horizontal" router>
      <el-menu-item index="/Home" class="menu-item">
        主页</el-menu-item>
      <el-menu-item index="/studentIntroduce" class="menu-item"
        >个人简历</el-menu-item
      >
      <el-menu-item
        class="menu-item"
        v-for="(v, i) in list"
        :key="i"
        index="/resolver"
        @click="getTitle(v.title)"
        >{{ v.title }}</el-menu-item
      >
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
  methods: {
    getTitle(title) {
      this.$store.commit("setRouterName", title);
      this.$emit("title", title);
    },
  },
};
</script>
<style scoped>
.navi {
  border-bottom: 4px solid #c80201;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #e8e8e8;
}
.menu-item {
  color: #585858 !important;
  font-size: 18px;
  font-weight: bold;
}
</style>
