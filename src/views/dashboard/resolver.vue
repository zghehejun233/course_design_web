<template>
  <el-container class="el-container" style="height: 100%; width: 100%">
    <el-aside width="200px">
      <Navi @title="getT"/>
    </el-aside>
    <el-container>
      <el-header
          style="
          height: 60px;
          background-color: #409eff;
          padding: 15px;
          text-align: center;
          border-radius: 2px;
        "
      >
        <div
            style="
            font-size: 24px;
            color: white;
            letter-spacing: 6px;
            font-family: 'PingFang SC', serif;
          "
        >
          学生管理系统
        </div>
      </el-header>
      <el-main>
        <div v-if="showTable == 1">
          <div v-if="showDescription == 1">
            <el-card>
              <div class="card-header">模块摘要</div>
              <div
                  v-for="(item,index) in descriptionList"
                  :key="index">
                <div
                    style="
                padding: 14px;
                font-size: 16px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
                >
                  {{ item.title }}
                </div>
                <div
                    v-for="(m_item,m_index) in item.content"
                    :key="m_index"
                    style="
                padding-left: 16px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
                >
                  {{ m_item }}
                </div>
              </div>
            </el-card>
          </div>
          <div v-if="showQuery == 1" class="query-block">
            <el-card class="search-card">
              <div id="search-text">检索</div>
              <div
                  v-for="(item, index) in queryList"
                  :key="index"
                  style="display: inline-block"
              >
                <el-input
                    v-if="item.type == 'input'"
                    v-model="item.value"
                    :placeholder="item.label"
                    style="width: 100%"
                />
                <el-select
                    v-if="item.type == 'select'"
                    v-model="item.value"
                    :placeholder="item.label"
                    style="width: 80%"
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
              <el-button type="primary" size="small" plain @click="queryTable()"
              >查询
              </el-button>
            </el-card>
          </div>
          <el-card style="margin-top: 12px; padding: 8px">
            <div v-if="showAdd == 1">
              <div class="action-bar">
                <span style="margin-right: 24px">操作</span>
                <el-button
                    type="primary"
                    size="small"
                    plain
                    round
                    style="
                    font-size: 14px;
                    display: flex-inline;
                    flex-direction: row;
                    align-items: center;
                  "
                    @click="addItem()"
                >
                  <CirclePlus
                      style="width: 12px; height: 12px; margin-right: 8px"
                  />
                  添加
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    plain
                    round
                    style="
                    font-size: 14px;
                    display: flex-inline;
                    flex-direction: row;
                    align-items: center;
                  "
                    @click="addItem()"
                >
                  <coin style="width: 12px; height: 12px; margin-right: 8px"/>
                  批量添加
                </el-button>
              </div>
            </div>
            <el-table
                class="table-content"
                style="width: 100%"
                height="600"
                size="mini"
                v-loading="loading"
                :data="tableList"
                border
                stripe
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
                        type="text"
                        @click="navigate(scope.$index, col.prop)"
                        style="margin-right: 5px"
                        size="mini"
                    >{{ scope.row[col.prop] }}
                    </el-button>
                  </div>
                  <div v-if="col.type === 'opers'">
                    <div
                        v-for="c in col.opers"
                        :key="c"
                        style="display: inline-block"
                    >
                      <el-tooltip
                          v-if="c.name == 'edit'"
                          class="box-item"
                          effect="light"
                          content="编辑"
                          placement="bottom-end"
                      >
                        <el-button
                            type="warning"
                            size="small"
                            @click="editRow(scope.row.id)"
                            circle
                        >
                          <edit
                              style="
                              width: 12px;
                              height: 12px;
                              margin-right: 2px;
                              margin-left: 2px;
                            "
                          />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                          v-else-if="c.name == 'detail'"
                          class="box-item"
                          effect="light"
                          content="详情"
                          placement="bottom-end"
                      >
                        <el-button
                            type="success"
                            size="small"
                            @click="detailRow(scope.row.id)"
                            circle
                        >
                          <files
                              style="
                              width: 12px;
                              height: 12px;
                              margin-right: 2px;
                              margin-left: 2px;
                            "
                          />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                          v-else-if="c.name == 'delete'"
                          class="box-item"
                          effect="light"
                          content="删除"
                          placement="bottom-end"
                      >
                        <el-button
                            type="danger"
                            size="small"
                            @click="detailRow(scope.row.id)"
                            style="margin: 2px"
                            circle
                        >
                          <delete
                              style="
                              width: 12px;
                              height: 12px;
                              margin-right: 2px;
                              margin-left: 2px;
                            "
                          />
                        </el-button>
                      </el-tooltip>
                      <el-button
                          type="primary"
                          v-else
                          @click="pushRow(scope.$index, c.name)"
                          style="margin-right: 5px"
                          size="mini"
                      >{{ c.label }}
                      </el-button>
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
          </el-card>
          <el-card style="margin-top: 12px">
            Powered By Vue.js and Element-plus UI kit
          </el-card>
        </div>

        <div v-if="showForm == 1" style="width:100%">
          <el-page-header title="返回" :content="formName" @back="goBack"/>

          <div class="table_center">
            <el-card style="wdith:960px;margin-top:24px">
              <table class="content">
                <tr
                    v-for="(item, index) in formList"
                    :key="index"
                    style="height: 40px"
                >
                  <td colspan="1" width="200">{{ item.label }}</td>
                  <td
                      colspan="5"
                      v-if="item.type == 'text'"
                      :v-html=item.value
                      style="font-size: 14px"
                  >
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
            </el-card>
          </div>
          <div v-if="showSubmit == '1'" class="centerButton">
            <el-button type="primary" size="large" @click="doSumit()"
            >提交
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navi from "@/components/Navi";

import {generalRequest} from "@/service/genServ.js";
import {getUimsConfig} from "@/service/genServ.js";

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
      showDescription: "",
      showAdd: "",
      loading: "",
      tableList: [],
      colsList: [],
      queryList: [],
      descriptionList: [],
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
    _self.loading = true;
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
            // 判断遍历到的page是否为table
            // 若是，则初始化值
            _self.showTable = "1";
            _self.showForm = "0";
            _self.name = _self.page[i].name;
            _self.colsList = _self.page[i].item;

            // 判断是否定义了查询
            if (_self.page[i].query != undefined) {
              if (Array.isArray(_self.page[i].query)) {
                _self.queryList = _self.page[i].query;
              } else {
                let arr = [];
                arr.push(_self.page[i].query);
                _self.queryList = arr;
              }
              _self.showQuery = "1";
            } else {
              _self.showQuery = "";
            }

            // 是否显示描述
            if (_self.page[i].description != undefined) {
              if (Array.isArray(_self.page[i].description)) {
                _self.descriptionList = _self.page[i].description;
              } else {
                let arr = [];
                arr.push(_self.page[i].description);
                _self.descriptionList = arr;
              }
              _self.showDescription = "1";
            } else {
              _self.showDescription = "";
            }
            // 是否显示添加按钮
            _self.showAdd = _self.page[i].showAdd;
            // 判断是否支持翻页
            _self.showPagination = _self.page[i].showPagination;
            var url = "/api/" + _self.rootUrl + "/" + _self.name + "Init";
            generalRequest(url, data).then((res) => {
              _self.tableList = res.data.data;
              _self.loading = false;
            });
          }

          // 判断是否为form
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
              for (var prop in _self.form) {
                for (var i = 0; i < _self.formList.length; i++) {
                  if (prop == _self.formList[i].prop) {
                    _self.formList[i].value = _self.form[prop];
                    if (_self.formList[i].type == "select") {
                      if (
                          _self.form[prop + "List"] != undefined &&
                          _self.form[prop + "List"] != ""
                      ) {
                        _self.formList[i].option = _self.form[prop + "List"];
                      }
                    }
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
                  _self.queryList = _self.page[i].query;
                } else {
                  let arr = [];
                  arr.push(_self.page[i].query);
                  _self.queryList = arr;
                }
                _self.showQuery = "1";
              } else {
                _self.showQuery = "";
              }

              // 是否显示描述
              if (_self.page[i].description != undefined) {
                if (Array.isArray(_self.page[i].description)) {
                  _self.descriptionList = _self.page[i].description;
                } else {
                  let arr = [];
                  arr.push(_self.page[i].description);
                  _self.descriptionList = arr;
                }
                _self.showDescription = "1";
              } else {
                _self.showDescription = "";
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
                      if (_self.formList[i].type == "select") {
                        if (
                            _self.form[pro + "List"] != undefined &&
                            _self.form[pro + "List"] != ""
                        ) {
                          _self.formList[i].option = _self.form[pro + "List"];
                        }
                      }
                    }
                  }
                }
              });
            }
          }
        }
      });
    },
    // 链接跳转
    navigate(index, prop) {
      var query = this.tableList[index][prop + "Paras"];
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

      if (this.modeName == "introduce") {
        this.$router.push({
          path: "studentIntroduce",
          query: this.objectPush,
        });
      } else {
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
                    _self.queryList = _self.page[i].query;
                  } else {
                    let arr = [];
                    arr.push(_self.page[i].query);
                    _self.queryList = arr;
                  }
                  _self.showQuery = "1";
                } else {
                  _self.showQuery = "";
                }

                // 是否显示描述
                if (_self.page[i].description != undefined) {
                  if (Array.isArray(_self.page[i].description)) {
                    _self.descriptionList = _self.page[i].description;
                  } else {
                    let arr = [];
                    arr.push(_self.page[i].description);
                    _self.descriptionList = arr;
                  }
                  _self.showDescription = "1";
                } else {
                  _self.showDescription = "";
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
                        if (_self.formList[i].type == "select") {
                          if (
                              _self.form[pro + "List"] != undefined &&
                              _self.form[pro + "List"] != ""
                          ) {
                            _self.formList[i].option = _self.form[pro + "List"];
                          }
                        }
                      }
                    }
                  }
                });
              }
            }
          }
        });
      }
    },
    pushRow(index, prop) {
      var query = this.tableList[index][prop + "Paras"];
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
                  _self.queryList = _self.page[i].query;
                } else {
                  let arr = [];
                  arr.push(_self.page[i].query);
                  _self.queryList = arr;
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
                      if (_self.formList[i].type == "select") {
                        if (
                            _self.form[pro + "List"] != undefined &&
                            _self.form[pro + "List"] != ""
                        ) {
                          _self.formList[i].option = _self.form[pro + "List"];
                        }
                      }
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
      var data = {id: id};
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
                    if (_self.formList[i].type == "select") {
                      if (
                          _self.form[pro + "List"] != undefined &&
                          _self.form[pro + "List"] != ""
                      ) {
                        _self.formList[i].option = _self.form[pro + "List"];
                      }
                    }
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
      var data = {id: id};
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
                    if (_self.formList[i].type == "select") {
                      if (
                          _self.form[pro + "List"] != undefined &&
                          _self.form[pro + "List"] != ""
                      ) {
                        _self.formList[i].option = _self.form[pro + "List"];
                      }
                    }
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
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].id == id) {
          this.index = i;
        }
      }
      var data = {id: id};
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
      for (var i = 0; i < this.queryList.length; i++) {
        var obj = {};
        var key = this.queryList[i].prop;
        var value = this.queryList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      console.log(data);
      generalRequest(url, data).then((res) => {
        this.tableList = res.data.data;
      });
    },

    doSumit() {
      var data = {id: this.id};
      for (var i = 0; i < this.formList.length; i++) {
        var obj = {};
        var key = this.formList[i].prop;
        var value = this.formList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      var url = "/api/" + this.rootUrl + "/" + this.name + "Submit";
      generalRequest(url, {form: data}).then((res) => {
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
      // 反转Form和Table的key，并未发生路由跳转
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
                    if (_self.formList[i].type == "select") {
                      if (
                          _self.form[pro + "List"] != undefined &&
                          _self.form[pro + "List"] != ""
                      ) {
                        _self.formList[i].option = _self.form[pro + "List"];
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    },
    goBack() {
      var _self = this;
      _self.showForm = 0;
      _self.showTable = 1;
      console.log("go back");
    },
  },
};
</script>

<style scoped>
html {
  height: 100%;
}

.rowButton {
  color: #79bbff;
}

.card-header {
  padding: 8px;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#search-text {
  margin-left: 20px;
  margin-right: 20px;
  padding: 4px;
  display: inline-block;
}

.search-card {
  height: 68px;
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: flex-start;
}

.query-block {
  height: 90%;
  width: 100%;
  align-content: center;
  align-items: center;
}

.action-bar {
  height: 30px;
  margin-left: 12px;
  padding: 4px;
  display: flex;
  flex-flow: row;
  align-items: center;
  align-content: center;
}
</style>
