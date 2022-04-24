<template>
  <Navi />
  <div class="app-container">
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
        <tr v-for="(item, index) in formList" :key="index" style="height: 40px">
          <td colspan="1" width="200">{{ item.label }}</td>
          <td colspan="5" v-if="item.onlyShow == 1" style="font-size: 14px">
            {{ item.value }}
          </td>
          <td colspan="5" v-if="item.showInput == 1">
            <el-input
              v-model="item.value"
              placeholder="请输入"
              style="width: 90%"
            />
          </td>
          <td colspan="5" v-if="item.showSelect == 1">
            <el-select
              v-model="item.value"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="items in item.itemList"
                :key="items.value"
                :label="items.label"
                :value="items.value"
              >
              </el-option>
            </el-select>
          </td>
          <td colspan="5" v-if="item.showDate == 1">
            <el-date-picker
              style="width: 90%"
              v-model="item.value"
              type="date"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </td>
        </tr>
      </table>
    </div>

    <div class="centerButton" v-show="showSubmit">
      <el-button size="mini" class="rowButton" @click="doSumit()"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import Navi from "@/components/Navi";
import { getUimsConfig } from "@/service/genServ.js";
import { generalRequest } from "@/service/genServ.js";
export default {
  name: "JumpForm",
  components: {
    Navi,
  },
  data() {
    return {
      title: "",
      showSubmit: "",
      page: [],
      formName: "",
      form: "",
      rootUrl: "teach",
      name: "",
      formList: [],
    };
  },
  created() {
    this.title = this.$route.query.name + this.$route.query.method;
 
    let _self = this;
    getUimsConfig().then((res) => {
      var jsonObj = JSON.parse(res.data.data);
      _self.page = jsonObj.ums.page;
      for (var i = 0; i < _self.page.length; i++) {
        console.log(_self.title);
        if (_self.title === _self.page[i].name) {
          _self.name = _self.page[i].name;
          _self.formName = _self.page[i].formName;
          _self.formList = _self.page[i].formList;
          _self.showSubmit = _self.page[i].showSubmit;
        }
      }
      var data = { id: _self.$route.query.id };
      var url = "/api/" + _self.rootUrl + "/" + _self.name;
      generalRequest(url, data).then((res) => {
        _self.form = res.data.data.form;
        for (var pro in _self.form) {
          for (var i = 0; i < _self.formList.length; i++) {
            if (pro == _self.formList[i].name) {
              _self.formList[i].value = _self.form[pro];
            }
          }
        }
      });
    });
  },
  methods: {
    doSumit() {
      var data = {};
      for (var i = 0; i < this.formList.length; i++) {
        var obj = {};
        var key = this.formList[i].name;
        var value = this.formList[i].value;
        obj[key] = value;
        Object.assign(data, obj);
      }
      var id = { id: this.$route.query.id };
      Object.assign(data, id);
      var url = "/api/" + this.rootUrl + "/sumitForm" + this.name;
      generalRequest(url, data).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
        } else {
          this.$message.error("提交失败");
        }
      });
    },
  },
};
</script>