<template>
  <Navi @title="getT" />
  <div class="app-container">
    <div v-if="showQuery == 1" style="margin-bottom: 5px">
      <div
        v-for="(item, index) in querList"
        :key="index"
        style="display: inline-block"
      >
        {{ item.label }}
        <el-input
          v-if="item.showInput == 1"
          v-model.number="item.value"
          style="width: 60%"
        />
        <el-select
          v-if="item.showSelect == 1"
          v-model="item.value"
          placeholder="请选择"
          style="width: 60%"
        >
          <el-option
            v-for="items in item.itemList"
            :key="items.value"
            :label="items.label"
            :value="items.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button size="mini" class="commButton" @click="query">查询</el-button>
    </div>
    <el-table
      class="table-content"
      style="width: 100%"
      size="mini"
      :data="
        tableList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      border
    >
      <el-table-column
        label="序号"
        fixed="left"
        width="50"
        align="center"
        color="black"
      >
        <template v-slot="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="col in colsList"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        align="center"
        color="black"
      >
        <template v-slot="scope" v-if="col.label === '操作'">
          <el-button
            type="primary"
            v-if="col.edit == 1"
            @click="editRow(scope.row.id)"
            size="mini"
            >编辑</el-button
          >
          <el-button
            type="success"
            v-if="col.detail == 1"
            @click="detailRow(scope.row.id)"
            size="mini"
            >详情</el-button
          >
          <el-button
            type="danger"
            v-if="col.detail == 1"
            @click="deleteRow(scope.row.id)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div
      style="margin: 0 auto; width: 800px"
      v-show="tableList.length > 0 && showPagination == 1"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 30, 50, 100, 200]"
        :page-size="pageSize"
        :total="tableList.length"
        style="margin-top: 15px"
        background
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <div v-if="showAdd == 1" class="centerButton">
      <el-button size="mini" class="rowButton" @click="addItem()"
        >添加</el-button
      >
    </div>
  </div>
</template>
<script>
import Navi from "@/components/Navi";

import { generalRequest } from "@/service/genServ.js";
import { getUimsConfig } from "@/service/genServ.js";
export default {
  name: "BaseTable",
  components: {
    Navi,
  },
  data() {
    return {
      index: 0,
      currentPage: 1,
      pageSize: 20,
      showQuery: "",
      showAdd: "",
      tableList: [],
      colsList: [],
      querList: [],
      rootUrl: "teach",
      showPagination: "",
      name: "",
      page: [],
    };
  },
  created() {
    var title = this.$store.state.routerName;
    let _self = this;
     getUimsConfig().then((res) => {
      var jsonObj = JSON.parse(res.data.data);
      if (jsonObj.ums.rootUrl !== undefined && jsonObj.ums.rootUrl !== "") {
        _self.rootUrl = jsonObj.ums.rootUrl;
      }
      _self.page = jsonObj.ums.page;
      for (var i = 0; i < _self.page.length; i++) {
        if (title === _self.page[i].title) {
          _self.name = _self.page[i].name;
          _self.colsList = _self.page[i].colsList;
          _self.showQuery = _self.page[i].showQuery;
          _self.querList = _self.page[i].querList;
          _self.showAdd = _self.page[i].showAdd;
          _self.showPagination = _self.page[i].showPagination;
        }
      }
      var data = {};
      var url = "/api/" + _self.rootUrl + "/" + _self.name;
      generalRequest(url, data).then((res) => {
        _self.tableList = res.data.data.tableList;
      });
    });
  },
  methods: {
    getT(title) {
      this.getXml(title);
    },
    getXml(title) {
      let _self = this;
       getUimsConfig().then((res) => {
      var jsonObj = JSON.parse(res.data.data);
        if (jsonObj.ums.rootUrl !== undefined && jsonObj.ums.rootUrl !== "") {
          _self.rootUrl = jsonObj.ums.rootUrl;
        }
        _self.page = jsonObj.ums.page;
        for (var i = 0; i < _self.page.length; i++) {
          if (title === _self.page[i].title) {
            _self.name = _self.page[i].name;
            _self.colsList = _self.page[i].colsList;
            _self.showQuery = _self.page[i].showQuery;
            _self.querList = _self.page[i].querList;
            _self.showAdd = _self.page[i].showAdd;
            _self.showPagination = _self.page[i].showPagination;
          }
        }
        var data = {};
        var url = "/api/" + _self.rootUrl + "/" + _self.name;
        generalRequest(url, data).then((res) => {
          _self.tableList = res.data.data.tableList;
        });
      });
    },
    editRow(id) {
      this.$router.push({
        path: "JumpForm",
        query: { id: id, name: this.name, method: "edit" },
      });
    },
    detailRow(id) {
      this.$router.push({
        path: "JumpForm",
        query: { id: id, name: this.name, method: "detail" },
      });
    },
    deleteRow(id) {
      var url = "/api/" + this.rootUrl + "/deleteItem" + this.name;

      for (var i = 0; i < this.tableList; i++) {
        if (this.tableList[i].id == id) this.index = i;
      }
      var data = { id: id };
      this.tableList.splice(this.index, 1);
      generalRequest(url, data).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    query() {
      var url = "/api/" + this.rootUrl + "/query" + this.name;
      var data = {};
      for (var i = 0; i < this.querList.length; i++) {
        var obj = {};
        var key = this.querList[i].name;
        var value = this.querList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      generalRequest(url, data).then((res) => {
        this.tableList = res.data.tableList;
      });
    },
    addItem() {
      this.$router.push({
        path: "JumpForm",
        query: { id: "", name: this.name, method: "addItem" },
      });
    },
  },
};
</script>

<style scoped>
</style>
