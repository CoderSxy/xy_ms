<template>
  <div class="app-container" id="container">
    <div class="map" id="map"></div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  data () {
    return {
      map: ""
    }
  },
  created() {

  },
  mounted() {
    this.initDate()
  },
  methods: {
    initDate() {
      this.map = L.map("map", {
        center: [31.41824973992844, 120.64499121934891], // 地图中心
        zoom: 14, //缩放比列
        zoomControl: false, //禁用 + - 按钮
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false // 移除右下角leaflet标识
      });
      let name = L.tileLayer(
        "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
      ).addTo(this.map);
    //   this.map.removeLayer(name)  // 移除图层
    }
  }
}

</script>

<style scoped>
#map {
  width: 100%;
  height: calc(100vh);
  z-index: 1;
}
</style>
