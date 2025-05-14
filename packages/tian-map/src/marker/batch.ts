import bg from "../assets/bg.png"
import {getData} from "../utils/data"

/**
 * 渲染1万个 Marker 点
 * 方案：利用队列的方式处理
 * 缺点：移动或者缩放的时候会卡顿
 */ 
export function batchCreateMarker() {

  // 初始化天地图
  const map = new T.Map('mapDiv', {
    center: new T.LngLat(116.40969, 39.89945),
    zoom: 12
  });

  const points = getData()
  console.log(points)

  // 分图层批量渲染（网页1方案增强）
  const layers = {
    default: new window.T.LayerGroup(),
    highlight: new window.T.LayerGroup()
  };

  // 分片加载（每批500个）
  let batch = 0;
  function loadBatch() {
    const batchPoints = points.slice(batch * 500, (batch + 1) * 500);

    batchPoints.forEach(p => {
      const marker = new window.T.Marker(new window.T.LngLat(p.lng, p.lat), {
        icon: new window.T.Icon({
          iconUrl: `${bg}`,
          iconSize: [32, 32]
        })
      });

      // 事件绑定优化（网页6方案）
      marker.on('click', () => alert(1));
      layers.default.addLayer(marker);
    });

    if (batch * 500 < points.length) {
      requestAnimationFrame(loadBatch);
      batch++;
    }
  }
  loadBatch();

  // 添加到地图
  map.addLayer(layers.default);
}