import L from "leaflet";
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
//定义地图实例
export const newMap = (domId, option) => {
  let map = L.map(domId, option)
  return map
}
//切片图层
export const createLayers = (map, url, option) => {
  let newLeayer = L.tileLayer(url, option)
  newLeayer.addTo(map)
  return newLeayer
}
//leaflet.ChineseTmsProviders插件加载地图
export const chinaLayers = (map, url, option) => {
  let chinaLeayer = L.tileLayer.chinaProvider(url, option)
  chinaLeayer.addTo(map)
  return chinaLeayer
}

// export default {newMap,createLayers,chinaLayers}
