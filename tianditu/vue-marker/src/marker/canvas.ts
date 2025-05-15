import bg from "../assets/bg.png"
import {getData} from "../utils/data"

/**
 * 优化版：渲染1万个 Marker 点
 * 方案：Canvas覆盖层 + 视口裁剪 + 事件代理
 */
export function optimizedCreateMarker() {
  // 初始化天地图
  const map = new T.Map('mapDiv', {
    center: new T.LngLat(116.40969, 39.89945),
    zoom: 12
  });

  // 生成模拟数据（1万点）
  const points = getData()
  console.log(points)

  // 创建Canvas覆盖层
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '90vh';
  canvas.style.zIndex = 1000;
  canvas.style.pointerEvents = 'none'; // 允许事件穿透到地图
  map.getContainer().appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let canvasWidth, canvasHeight;

  // 图标预加载
  const iconImage = new Image();
  iconImage.src = bg;

  // 当前可见区域的点
  let visiblePoints = [];
  // 点的大小（像素）
  const pointSize = 16;

  // 监听地图变化事件
  function updateCanvasSize() {
    const container = map.getContainer();
    canvasWidth = container.offsetWidth;
    canvasHeight = container.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    renderPoints();
  }

  // 计算可见区域内的点
  function calculateVisiblePoints() {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return points.filter(point => {
      const lng = point.lng;
      const lat = point.lat;
      return lng >= sw.lng && lng <= ne.lng && lat >= sw.lat && lat <= ne.lat;
    });
  }

  // 渲染可见点
  function renderPoints() {
    if (!iconImage.complete) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    visiblePoints.forEach(point => {
      const pixel = map.lngLatToContainerPoint(new T.LngLat(point.lng, point.lat));
      ctx.drawImage(iconImage, pixel.x - pointSize / 2, pixel.y - pointSize / 2, pointSize, pointSize);
    });
  }

  // 事件代理 - 处理Canvas上的点击
  function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 查找被点击的点（简化版，使用固定半径）
    const clickedPoint = visiblePoints.find(point => {
      const pixel = map.lngLatToContainerPoint(new T.LngLat(point.lng, point.lat));
      const dx = x - pixel.x;
      const dy = y - pixel.y;
      return Math.sqrt(dx * dx + dy * dy) < pointSize / 2;
    });

    if (clickedPoint) {
      alert(`点击了点: ${clickedPoint.lng}, ${clickedPoint.lat}`);
    }
  }

  // 地图状态变化时更新渲染
  function updateMapState() {
    visiblePoints = calculateVisiblePoints();
    renderPoints();
  }

  // 初始化
  function init() {
    // 等待图标加载完成
    updateCanvasSize();
    updateMapState();

    // 监听地图事件
    map.addEventListener('resize', updateCanvasSize);
    map.addEventListener('moveend', updateMapState);
    map.addEventListener('zoomend', updateMapState);

    // 点击事件代理
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('click', handleCanvasClick);
  }

  init();
}