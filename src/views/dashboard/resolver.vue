<template>
  <Navi @title="getT" />
  <div class="app-container">
    <div v-if="showTable == 1">
      <div v-if="showQuery == 1" style="margin-bottom: 5px">
        <div
          v-for="(item, index) in querList"
          :key="index"
          style="display: inline-block"
        >
          {{ item.label }}
          <el-input
            v-if="item.type == 'input'"
            v-model="item.value"
            style="width: 60%"
          />
          <el-select
            v-if="item.type == 'select'"
            v-model="item.value"
            placeholder="请选择"
            style="width: 60%"
          >
            <el-option
              v-for="items in item.option"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button size="mini" class="commButton" @click="queryTable()"
          >查询</el-button
        >
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
          <template v-slot="scope" v-if="col.type != undefined">
            <div v-if="col.type === 'text'">
              {{ scope.row[col.prop] }}
            </div>
            <div v-if="col.type === 'link'">
              <el-button
                type="primary"
                @click="navigate(scope.$index, col.prop)"
                style="margin-right: 5px"
                size="mini"
                >{{ col.label }}</el-button
              >
            </div>
            <div v-if="col.type === 'opers'">
              <div
                v-for="c in col.opers"
                :key="c"
                style="display: inline-block"
              >
                <el-button
                  type="primary"
                  v-if="c.name == 'edit'"
                  @click="editRow(scope.row.id)"
                  style="margin-right: 5px"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  type="success"
                  v-if="c.name == 'detail'"
                  @click="detailRow(scope.row.id)"
                  style="margin-right: 5px"
                  size="mini"
                  >详情</el-button
                >
                <el-button
                  type="danger"
                  v-if="c.name == 'delete'"
                  @click="deleteRow(scope.row.id)"
                  style="margin-right: 5px"
                  size="mini"
                  >删除</el-button
                >
              </div>
            </div>
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

    <div v-if="showForm == 1">
      <div class="table_center">
        <table class="content">
          <tr>
            <td
              colspan="6"
              style="font-size: 24px; font-weight: bold; color: #304156"
            >
              {{ formName }}
            </td>
          </tr>
          <tr
            v-for="(item, index) in formList"
            :key="index"
            style="height: 40px"
          >
            <td colspan="1" width="200">{{ item.label }}</td>
            <td colspan="5" v-if="item.type == 'text'" style="font-size: 14px">
              {{ item.value }}
            </td>
            <td colspan="5" v-if="item.type == 'input'">
              <el-input
                v-model="item.value"
                placeholder="请输入"
                style="width: 90%"
              />
            </td>
            <td colspan="5" v-if="item.type == 'select'">
              <el-select
                v-model="item.value"
                placeholder="请选择"
                style="width: 90%"
              >
                <el-option
                  v-for="items in item.option"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                >
                </el-option>
              </el-select>
            </td>
            <td colspan="5" v-if="item.type == 'date'">
              <el-date-picker
                style="width: 90%"
                v-model="item.value"
                type="date"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="showSubmit == '1'" class="centerButton">
        <el-button size="mini" class="rowButton" @click="doSumit()"
          >提交</el-button
        >
      </div>
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
      id: "",
      showTable: "",
      showForm: "",
      showSubmit: "",
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
      formName: "",
      modelName: "",
      objectPush: {},
      form: "",
      page: [],
      formList: [],
    };
  },
  created() {
    var title = this.$store.state.routerName;
    let _self = this;
    getUimsConfig().then((res) => {
      var jsonObj = res.data.data;
      if (jsonObj.uims.rootUrl !== undefined && jsonObj.uims.rootUrl !== "") {
        _self.rootUrl = jsonObj.uims.rootUrl;
      }

      _self.page = jsonObj.uims.page;
      var data = {};

      for (var i = 0; i < _self.page.length; i++) {
        if (title === _self.page[i].title) {
          if (_self.page[i].type == "table") {
            _self.showTable = "1";
            _self.showForm = "0";
            _self.name = _self.page[i].name;
            _self.colsList = _self.page[i].item;

            if (_self.page[i].query != undefined) {
              if (Array.isArray(_self.page[i].query)) {
                _self.querList = _self.page[i].query;
              } else {
                let arr = [];
                arr.push(_self.page[i].query);
                _self.querList = arr;
              }

              _self.showQuery = "1";
            } else {
              _self.showQuery = "";
            }

            _self.showAdd = _self.page[i].showAdd;
            _self.showPagination = _self.page[i].showPagination;
            var url = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
            generalRequest(url, data).then((res) => {
              _self.tableList = res.data.data;
            });
          }
          if (_self.page[i].type == "form") {
            _self.showForm = "1";
            _self.showTable = "0";
            _self.name = _self.page[i].name;
            _self.formName = _self.page[i].title;
            _self.formList = _self.page[i].item;
            _self.id = "";
            var urlF = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
            generalRequest(urlF, data).then((res) => {
              _self.form = res.data.data;
              for (var pro in _self.form) {
                for (var i = 0; i < _self.formList.length; i++) {
                  if (pro == _self.formList[i].prop) {
                    _self.formList[i].value = _self.form[pro];
                  }
                }
              }
            });
          }
        }
      }
    });
  },
  methods: {
    getT(title) {
      this.getXml(title);
    },
    getXml(title) {
      let _self = this;
      getUimsConfig().then((res) => {
        var jsonObj = res.data.data;
        if (jsonObj.uims.rootUrl !== undefined && jsonObj.uims.rootUrl !== "") {
          _self.rootUrl = jsonObj.uims.rootUrl;
        }
        _self.page = jsonObj.uims.page;
        var data = {};
        for (var i = 0; i < _self.page.length; i++) {
          if (title === _self.page[i].title) {
            if (_self.page[i].type == "table") {
              _self.showTable = "1";
              _self.showForm = "0";
              _self.name = _self.page[i].name;
              _self.colsList = _self.page[i].item;
              if (_self.page[i].query != undefined) {
                if (Array.isArray(_self.page[i].query)) {
                  _self.querList = _self.page[i].query;
                } else {
                  let arr = [];
                  arr.push(_self.page[i].query);
                  _self.querList = arr;
                }

                _self.showQuery = "1";
              } else {
                _self.showQuery = "";
              }
              _self.showAdd = _self.page[i].showAdd;
              _self.showPagination = _self.page[i].showPagination;
              var url = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
              generalRequest(url, data).then((res) => {
                _self.tableList = res.data.data;
              });
            }
            if (_self.page[i].type == "form") {
              _self.showForm = "1";
              _self.showTable = "0";
              _self.name = _self.page[i].name;
              _self.formName = _self.page[i].title;
              _self.formList = _self.page[i].item;
              _self.id = "";
              var urlF = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
              generalRequest(urlF, data).then((res) => {
                _self.form = res.data.data;
                for (var pro in _self.form) {
                  for (var i = 0; i < _self.formList.length; i++) {
                    if (pro == _self.formList[i].prop) {
                      _self.formList[i].value = _self.form[pro];
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
    navigate(index, prop) {
      var query = this.tableList[index][prop];
      var vars = query.split("&");
      this.objectPush = {};
      this.modeName = "";
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (i == 0) {
          this.modeName = pair[1];
        } else {
          var key = pair[0];
          var value = pair[1];
          var obj = {};
          obj[key] = value;

          Object.assign(this.objectPush, obj);
        }
      }

      let _self = this;

      getUimsConfig().then((res) => {
        var jsonObj = res.data.data;
        _self.page = jsonObj.uims.page;
        var data = {};
        for (var i = 0; i < _self.page.length; i++) {
          if (this.modeName === _self.page[i].name) {
            if (_self.page[i].type == "table") {
              _self.showTable = "1";
              _self.showForm = "0";
              _self.name = _self.page[i].name;
              _self.colsList = _self.page[i].item;
              if (_self.page[i].query != undefined) {
                if (Array.isArray(_self.page[i].query)) {
                  _self.querList = _self.page[i].query;
                } else {
                  let arr = [];
                  arr.push(_self.page[i].query);
                  _self.querList = arr;
                }

                _self.showQuery = "1";
              } else {
                _self.showQuery = "";
              }
              _self.showAdd = _self.page[i].showAdd;
              _self.showPagination = _self.page[i].showPagination;
              var url = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
              Object.assign(data, this.objectPush);
              generalRequest(url, data).then((res) => {
                _self.tableList = res.data.data;
              });
            }
            if (_self.page[i].type == "form") {
              _self.showForm = "1";
              _self.showTable = "0";
              _self.name = _self.page[i].name;
              _self.formName = _self.page[i].title;
              _self.formList = _self.page[i].item;
              _self.id = "";
              var urlF = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
              Object.assign(data, this.objectPush);
              generalRequest(urlF, data).then((res) => {
                _self.form = res.data.data;
                for (var pro in _self.form) {
                  for (var i = 0; i < _self.formList.length; i++) {
                    if (pro == _self.formList[i].prop) {
                      _self.formList[i].value = _self.form[pro];
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
    editRow(id) {
      this.showForm = "1";
      this.showTable = "0";
      this.id = id;
      var data = { id: id };
      this.showSubmit = "1";
      var namePage = this.name + "Edit";
      let _self = this;
      getUimsConfig().then((res) => {
        var jsonObj = res.data.data;
        if (jsonObj.uims.rootUrl !== undefined && jsonObj.uims.rootUrl !== "") {
          _self.rootUrl = jsonObj.uims.rootUrl;
        }
        _self.page = jsonObj.uims.page;
        for (var i = 0; i < _self.page.length; i++) {
          if (namePage === _self.page[i].name) {
            _self.name = _self.page[i].name;
            _self.formName = _self.page[i].title;
            _self.formList = _self.page[i].item;
            var urlF = "/api/" + _self.rootUrl + "/" + namePage + "Init";
            generalRequest(urlF, data).then((res) => {
              _self.form = res.data.data;
              for (var pro in _self.form) {
                for (var i = 0; i < _self.formList.length; i++) {
                  if (pro == _self.formList[i].prop) {
                    _self.formList[i].value = _self.form[pro];
                  }
                }
              }
            });
          }
        }
      });
    },
    detailRow(id) {
      this.showForm = "1";
      this.showTable = "0";
      var data = { id: id };
      this.id = id;
      this.showSubmit = "0";
      var namePage = this.name + "Edit";
      let _self = this;
      getUimsConfig().then((res) => {
        var jsonObj = res.data.data;
        if (jsonObj.uims.rootUrl !== undefined && jsonObj.uims.rootUrl !== "") {
          _self.rootUrl = jsonObj.uims.rootUrl;
        }
        _self.page = jsonObj.uims.page;
        for (var i = 0; i < _self.page.length; i++) {
          if (namePage === _self.page[i].name) {
            _self.name = _self.page[i].name;
            _self.formName = _self.page[i].title;
            _self.formList = _self.page[i].item;
            var urlF = "/api/" + _self.rootUrl + "/" + namePage + "Init";
            generalRequest(urlF, data).then((res) => {
              _self.form = res.data.data;
              for (var pro in _self.form) {
                for (var i = 0; i < _self.formList.length; i++) {
                  if (pro == _self.formList[i].prop) {
                    _self.formList[i].value = _self.form[pro];
                  }
                }
              }
            });
          }
        }
      });
    },
    deleteRow(id) {
      var url = "/api/" + this.rootUrl + "/" + this.name + "Delete";
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
    queryTable() {
      var url = "/api/" + this.rootUrl + "/" + this.name + "Query";
      var data = {};
      for (var i = 0; i < this.querList.length; i++) {
        var obj = {};
        var key = this.querList[i].prop;
        var value = this.querList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      generalRequest(url, data).then((res) => {
        this.tableList = res.data.data;
      });
    },

    doSumit() {
      var data = { id: this.id };
      for (var i = 0; i < this.formList.length; i++) {
        var obj = {};
        var key = this.formList[i].prop;
        var value = this.formList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      var url = "/api/" + this.rootUrl + "/" + this.name + "Submit";
      generalRequest(url, { form: data }).then((res) => {
        if (res.code == 0) {
          this.id = res.data.data.id;
          this.$message({
            message: "提交成功",
            type: "success",
          });
        } else {
          this.$message.error("提交失败");
        }
      });
    },

    addItem() {
      this.id = "";
      this.showForm = "1";
      this.showTable = "0";
      var data = {};

      this.showSubmit = "1";
      var namePage = this.name + "Edit";
      let _self = this;
      getUimsConfig().then((res) => {
        var jsonObj = res.data.data;
        if (jsonObj.uims.rootUrl !== undefined && jsonObj.uims.rootUrl !== "") {
          _self.rootUrl = jsonObj.uims.rootUrl;
        }
        _self.page = jsonObj.uims.page;
        for (var i = 0; i < _self.page.length; i++) {
          if (namePage === _self.page[i].name) {
            _self.name = _self.page[i].name;
            _self.formName = _self.page[i].title;
            _self.formList = _self.page[i].item;
            var urlF = "/api/" + _self.rootUrl + "/" + namePage + "Init";
            generalRequest(urlF, data).then((res) => {
              _self.form = res.data.data;
              for (var pro in _self.form) {
                for (var i = 0; i < _self.formList.length; i++) {
                  if (pro == _self.formList[i].prop) {
                    _self.formList[i].value = _self.form[pro];
                  }
                }
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
