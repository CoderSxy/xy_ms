<template>
  <div class="center">
    <div class="select">
      <el-select v-model="mapUrl" @change="changeMap" placeholder="请选择地图类型">
        <el-option v-for="item in mapList" :key="item.id" :label="item.name" :value="item.url">
        </el-option>
      </el-select>
    </div>
    <div id="maps" class="map"></div>
  </div>
</template>

<script>
import {newMap, createLayers, chinaLayers} from './map_utils'
export default {
  data(){
    return {
      map: null,
      layers: null,
      mapList: [{
          id: 1,
          name: '智图地图',
          url: 'Geoq.Normal.Map'
        },
        {
          id: 4,
          name: '天地影像',
          url: 'TianDiTu.Satellite.Map'
        },
        {
          id: 5,
          name: '午夜蓝',
          url: 'Geoq.Normal.PurplishBlue'
        },
        {
          id: 6,
          name: '高德地图',
          url: 'GaoDe.Satellite.Map'
        }
      ],
      // mapUrl: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
      // mapUrl: 'Geoq.Normal.Map',
      mapUrl: 'Geoq.Normal.PurplishBlue',
      option: {  //leaflet.pm配置项
        position: "topleft",
        drawPolygon: true, // 添加绘制多边形
        drawMarker: true, //添加按钮以绘制标记
        drawCircleMarker: true, //添加按钮以绘制圆形标记
        drawPolyline: true, //添加按钮绘制线条
        drawRectangle: true, //添加按钮绘制矩形
        drawCircle: true, //  添加按钮绘制圆圈
        editMode: true, //  添加按钮编辑多边形
        dragMode: true, //   添加按钮拖动多边形
        cutPolygon: false, // 添加一个按钮以删除图层里面的部分内容
        removalMode: false // 清除图层
      },
      options: {  //地图基本功能配置项
        minZoom: 0,
        maxZoom: 20,
        // center: [39.125596, 117.190182],
        center: [31.41824973992844, 120.64499121934891],
        zoom: 10,
        zoomControl: true, //禁用 + - 按钮
        doubleClickZoom: true, // 禁用双击放大
        attributionControl: false, // 移除右下角leaflet标识
        dragging: true, //禁止鼠标拖动滚动
        boxZoom: true, //决定地图是否可被缩放到鼠标拖拽出的矩形的视图，鼠标拖拽时需要同时按住shift键.
        scrollWheelZoom: true, //禁止鼠标滚动缩放
      },
      districts: null,

    }
  },
  mounted() {
    this.getMap()
  },
  methods: {
    //生成地图实例
    getMap() {
      this.map = newMap('maps', this.options) //地图容器id与基本配置
      // this.$map.createLayers(this.map, this.mapUrl, this.option) //引入地图图层
      this.layers = chinaLayers(this.map, this.mapUrl) //加载各种地图
      this.map.pm.setLang('zh'); //设置语言  en, de, it, ru, ro, es, fr, pt_br, zh , nl
      this.map.pm.addControls(this.option) //添加工具
    },
    //动态切换地图
    changeMap(map) {
      this.mapUrl = map
      this.map.removeLayer(this.layers)
      this.$nextTick(() => {
        this.layers = chinaLayers(this.map, this.mapUrl)
      })
    },
  }
}
</script>

<style lang="scss">
  .center {
    width: 100%;
    height: calc(100vh - 84px);
    z-index: 1;
    margin: auto;

    .select {
      width: 150px;
      position: absolute;
      top: 5%;
      left: 85%;
      z-index: 2;
    }

   .map {
     width: 100%;
     height: calc(100vh - 84px);
     z-index: 1;
     margin: auto;
   }
  }
</style>

