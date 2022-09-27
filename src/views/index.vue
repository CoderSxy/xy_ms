<template>
  <!-- <div class="dashboard-editor-container">
    <dv-full-screen-container>
      <img src="@/assets/images/beijing.png" alt="developing" />
      <dv-border-box-1 class="table-content">
        <div class="content">
          <dv-scroll-board class="table-info" :config="config"  />
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div> -->
  <div>
    <div id="container_max" class="app-page" ref="pageContentRef" v-loading="loading">
      <div class="page-top">
        <div class="currentDate">
          <div>{{dateFormat(currentDate)}}</div>
        </div>
        <div class="screenfull">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" id="fullscreen_button" @click="clickFull"/>
        </div>
      </div>
      <div class="page-body" >
        <dv-scroll-board class="table-info"  :config="getConfig"  />
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from "screenfull"
import { listRanking} from '@/api/ranking'
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      loading: false,
      dateTimer: null,
      currentDate: new Date(), //显示实时时间
      isFullscreen: false,
      dataList:[],
      version: "3.8.3",

      header: [],
      list:[
      ],
      rowNum:20,
      formatterObj: {
        ranking: '排名',
        username: '玩家',
        role: '职业',
        score: '分数',
        desc: '选手介绍',
        level: '选手等级'
      }


    };
  },
  computed: {
    getConfig() {
      return {header:this.header, data: this.list,rowNum: this.rowNum, columnWidth:[80,80,80,80,770,80],headerBGC: '#034076'}
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.dateTimer = setInterval(() => {
      this.currentDate = new Date(); // 修改数据currentDate
    }, 1000)
    this.listenScreenFull()
  },
  beforeDestroy() {
    clearInterval(this.dateTimer)
  },
  methods: {
    getList() {
      this.loading = true;
      listRanking(this.queryParams).then(response => {
          this.dataList = response.data.list;
          this.dataList.forEach(item => {
            delete item.id
            delete item.sortid
            delete item.remark
          })
          this.loading = false;
          this.header = this.dataList.length ? this.formatterKeys(Object.keys(this.dataList[0])) : []
          this.list = this.dataList.length ? this.dataList.map(item => Object.values(item)) : []
        }
      );
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
    formatterKeys(arr) {
      const res = arr.map(item => this.formatterObj[item])
      return res
    },
    dateFormat(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
      * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
      * */
      let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1
      let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate()
      let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours()
      let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes()
      let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds()
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
    },
    // 事件监听函数
    fullScreenChangeFn() {
      this.isFullscreen = !this.isFullscreen //你要切换得图标使用得属性
    },

    listenScreenFull() {
      //这些监听,可以监听到esc按键按下导致的全屏变化,但是监听不到F11的打开全屏的变化,isScreenFull
      document.addEventListener("fullscreenchange", () => {
        this.isFullscreen = !this.isFullscreen //你要切换得图标使用得属性
      })
      document.addEventListener("mozfullscreenchange", () => {
        this.isFullscreen = !this.isFullscreen
      })
      document.addEventListener("webkitfullscreenchange", () => {
        this.isFullscreen = !this.isFullscreen
      })
      document.addEventListener("msfullscreenchange", () => {
        this.isFullscreen = !this.isFullscreen
      })
    },
    clickFull() { //数据大屏全屏控制
      const element = document.getElementById('container_max');//指定全屏区域元素
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle(element)
      // this.isFullscreen = !screenfull.isFullscreen
    },
  },
};
</script>

<style scoped lang="scss">
/* .dashboard-editor-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
  display: inline-block;
  img {
    width: 100%;
    height: calc(100vh);
  }
} */
.app-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* background-image: url('../assets/images/login-background.jpg'); */
  background-image: url('../assets/images/beijing.png');

  .page-top {
    height: 80px;
    width: 100%;
    /* background-repeat: no-repeat;
    background-size: 100% 140px;
    background-image: url('../../assets/dataScreen/dataScreenTopBg.png'); */

    .top-title {
      width: 100%;
      height: 130px;
      line-height: 130px;
      text-align: center;
      display: flex;
      justify-content: center;

      .top-title-text {
        width: 445px;
        font-size: 25px;
        font-family: Alimama ShuHeiTi;
        font-weight: bold;
        color: #FFFFFF;
        img {
          vertical-align: middle;
        }
        span {
          margin: 0 10px;
          background-image: linear-gradient(#79C7FF,#E8FEFF);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      }
    }
  }
  .page-body{
    position: relative;
    top: -20px;
    padding: 0 20px;

    width: 100%;
    .table-info {
      opacity: 0.75;
      width: 100%;
      height: 500px;
    }
  }
}

.screenfull {
  width: 30px;
  height: 30px;
  position: absolute;
  float: right;
  top: 28px;
  right: 30px;
  cursor: pointer;
  color: #FFFFFF;
}

  .currentDate {
    position: absolute;
    left: 120px;
    height: 70px;
    line-height: 70px;
    margin-left: 30px;
    color: #FFFFFF;
  }

</style>

