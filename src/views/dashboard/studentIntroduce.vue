<template>
  <el-container class="el-container" style="height: 100%; width: 100%">
    <el-aside width="200px">
      <Navi />
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
        <div class="about">
          <el-card class="box-card">
            <div class="card-header">基本信息</div>
            <div
              class="item"
              style="
                display: flex;
                flex-direction: row;
                align-content: center;
                align-items: center;
              "
            >
              <div class="item header-img" style="width: 180px">
                <el-image
                  src="https://gravatar.loli.net/avatar/c14402ce10441a645a6151118eef7609?d=retro&v=1.4.18"
                  fit="fill"
                />
              </div>
              <div
                class="item"
                style="
                  display: flex;
                  flex-direction: column;
                  align-content: center;
                  align-items: start;
                "
              >
                <div>姓名： {{ myName }}</div>
                <div>性别： {{ sex }}</div>
                <div>年龄： {{ age }}</div>
                <div>学院专业： {{ overview }}</div>
                <div>学号： {{ studentNum }}</div>
                <div>联系方式： {{ contact }}</div>
              </div>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-content: center;
                align-items: center;
              "
            >
              <div class="card-header;margin-bottom:36px">
                {{ myName }}的综合成绩分布
              </div>
              <Radar
                v-if="studyChartLoaded"
                :chart-options="studyChartOptions"
                :chart-data="studyChartData"
                :chartId="studyChartId"
                style="width: 400px"
              />
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-content: center;
                align-items: center;
              "
            >
              <div class="card-header;margin-bottom:36px">
                {{ myName }}的生活重心分布
              </div>
              <PolarArea
                v-if="lifeChartLoaded"
                :chart-options="lifeChartOptions"
                :chart-data="lifeChartData"
                :chartId="lifeChartId"
                style="width: 400px"
              />
            </div>
          </el-card>

          <el-card class="box-card">
            <div
                class="item"
                style="
                display: flex;
                flex-direction: column;
                align-content: start;
                align-items: start;
              "
            >
              <el-row
                  type="flex"
                  style="margin-left: 12px; margin-right: 12px; width: 100%"
                  :gutter="110"
                  v-for="(item, i) in attachList"
                  :key="i"
              >
                <div class="paragraph-header">{{ item.title }}</div>
                <div v-html="item.content"></div>
              </el-row>
            </div>
          </el-card>
          <el-button style="margin-top: 12px" size="primary" @click="downPDF()"
            >下载简历
          </el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navi from "@/components/Navi";
import { getStudentIntroduceData } from "@/service/genServ.js";
import { downloadPost } from "@/service/genServ.js";
import { Radar, PolarArea } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  RadialLinearScale,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  RadialLinearScale,
  LineElement
);

export default {
  name: "Home",
  components: {
    Navi,
    Radar,
    PolarArea,
  },
  props: {
    studyChartId: {
      type: String,
      default: "radar-chart",
    },
    studyDatasetIdKey: {
      type: String,
      default: "label",
    },
    lifeChartId: {
      type: String,
      default: "polar-area-chart",
    },
    height: {
      type: Number,
      default: 400,
    },
    width: {
      type: Number,
      default: 400,
    },
  },
  created() {
    this.objectPush = this.$route.query;
    getStudentIntroduceData({ ...this.objectPush }).then((res) => {
      this.myName = res.data.data.myName;
      this.overview = res.data.data.overview;
      this.sex = res.data.data.sex;
      this.age = res.data.data.age;
      this.studentNum = res.data.data.studentNum;
      this.contact = res.data.data.contact;
      this.img_url = res.data.data.img_url;
      this.studyChartLoaded = "true";
      this.lifeChartLoaded = "true";
      this.studyChartData.labels = res.data.data.studyChartLabels;
      this.studyChartData.datasets = res.data.data.studyChartData;
      this.lifeChartData.labels = res.data.data.lifeChartLabels;
      this.lifeChartData.datasets = res.data.data.lifeChartData;
      this.lifeChartData.backgroundColor = res.data.data.lifeChartColors;
      this.attachList = res.data.data.attachList;
      this.basicList = res.data.data.basicList;
    });
  },
  data() {
    return {
      studyChartData: {
        labels: [],
        datasets: [{}],
      },
      studyChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
      },
      studyChartLoaded: "false",
      lifeChartData: {
        labels: [],
        datasets: [{}],
      },
      lifeChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      lifeChartLoaded: "false",
      lifeChartColors:"",
      objectPush: "",
      myName: "",
      overview: "",
      sex:"",
      age:"",
      studentNum:"",
      contact:"",
      attachList: "",
      basicList: "",
    };
  },
  methods: {
    downPDF() {
      downloadPost(
        "/api/teach/getStudentIntroducePdf",
        "个人简历",
        { ...this.objectPush }
      );
    },
  },
};
</script>
<style scoped>
html {
  height: 100%;
  width: 100%;
}

.about {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.paragraph-header {
  margin-right: 24px;
  width: 64px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  font-size: 14px;
  margin-bottom: 18px;
}

.box-card {
  margin-top: 12px;
  padding: 8px;
  width: 720px;
}

.header-img {
  padding: 8px;
}
</style>