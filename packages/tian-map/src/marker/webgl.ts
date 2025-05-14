import bg from "../assets/bg.png"
import {getData} from "../utils/data"

/**
 * WebGL 版：渲染大量 Marker 点
 * 方案：使用 WebGL 着色器直接渲染点精灵
 */
export function webglCreateMarker() {
  // 初始化天地图
  const map = new T.Map('mapDiv', {
    center: new T.LngLat(116.40969, 39.89945),
    zoom: 12
  });

  // 生成模拟数据（1万点）
  const points = getData()
  console.log(points)

  // 创建WebGL画布
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '90vh';
  canvas.style.zIndex = 1000;
  canvas.style.pointerEvents = 'none';
  map.getContainer().appendChild(canvas);

  // 获取WebGL上下文
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    alert('浏览器不支持WebGL，无法使用此优化方案');
    return;
  }

  // 存储WebGL资源
  let program;
  let positionBuffer;
  let texture;
  let pointSize = 16;
  let vertexCount = 0;

  // 顶点着色器
  const vertexShaderSource = `
    attribute vec2 a_position;
    uniform mat4 u_matrix;
    uniform float u_pointSize;
    
    void main() {
      gl_Position = u_matrix * vec4(a_position, 0, 1);
      gl_PointSize = u_pointSize;
    }
  `;

  // 片元着色器
  const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_texture;
    
    void main() {
      gl_FragColor = texture2D(u_texture, gl_PointCoord);
    }
  `;

  // 创建着色器程序
  function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
  }

  // 创建纹理
  function createTexture(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 上传图像数据
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    return texture;
  }

  // 更新WebGL数据
  function updateWebGLData() {
    // 获取地图可见区域
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    // 过滤可见点（WebGL版视口裁剪）
    const visiblePoints = points.filter(point => {
      const lng = point.lng;
      const lat = point.lat;
      return lng >= sw.lng && lng <= ne.lng && lat >= sw.lat && lat <= ne.lat;
    });

    // 创建顶点数据（经纬度转换为屏幕坐标）
    const positions = [];
    visiblePoints.forEach(point => {
      const pixel = map.lngLatToContainerPoint(new T.LngLat(point.lng, point.lat));
      // 转换为WebGL坐标系统（-1到1）
      const x = (pixel.x / canvas.width) * 2 - 1;
      const y = 1 - (pixel.y / canvas.height) * 2;
      positions.push(x, y);
    });

    // 更新缓冲区
    vertexCount = visiblePoints.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  // 渲染函数
  function render() {
    if (!program || !texture) return;

    // 设置视口
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 清空画布
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 使用程序
    gl.useProgram(program);

    // 设置顶点属性
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 设置统一变量
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const pointSizeLocation = gl.getUniformLocation(program, 'u_pointSize');
    const textureLocation = gl.getUniformLocation(program, 'u_texture');

    // 设置单位矩阵（直接使用归一化设备坐标）
    const matrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // 设置点大小
    gl.uniform1f(pointSizeLocation, pointSize);

    // 设置纹理
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation, 0);

    // 绘制点
    gl.drawArrays(gl.POINTS, 0, vertexCount);
  }

  // 初始化WebGL
  function initWebGL() {
    // 创建着色器程序
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    // 创建位置缓冲区
    positionBuffer = gl.createBuffer();

    // 加载图标纹理
    const iconImage = new Image();
    iconImage.src = bg;
    iconImage.onload = () => {
      texture = createTexture(gl, iconImage);
      updateWebGLData();
      render();
    };
  }

  // 监听地图变化事件
  function setupMapListeners() {
    // 地图大小变化
    map.addEventListener('resize', () => {
      const container = map.getContainer();
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      updateWebGLData();
      render();
    });

    // 地图移动或缩放
    map.addEventListener('moveend', () => {
      updateWebGLData();
      render();
    });

    map.addEventListener('zoomend', () => {
      // 根据缩放级别调整点大小
      pointSize = 16 / Math.pow(2, map.getZoom() - 12);
      updateWebGLData();
      render();
    });
  }

  // 事件代理 - 处理WebGL画布上的点击
  function setupEventHandling() {
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 将点击坐标转换为WebGL坐标
      const webglX = (x / canvas.width) * 2 - 1;
      const webglY = 1 - (y / canvas.height) * 2;

      // 获取地图可见区域
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      // 查找被点击的点
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point.lng < sw.lng || point.lng > ne.lng || point.lat < sw.lat || point.lat > ne.lat) {
          continue; // 跳过不可见点
        }

        const pixel = map.lngLatToContainerPoint(new T.LngLat(point.lng, point.lat));
        const pointX = (pixel.x / canvas.width) * 2 - 1;
        const pointY = 1 - (pixel.y / canvas.height) * 2;

        // 计算距离
        const dx = webglX - pointX;
        const dy = webglY - pointY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 点精灵的半径约为 pointSize/2（WebGL单位）
        const pointRadius = (pointSize / 2) / canvas.width;

        if (distance < pointRadius) {
          alert(`点击了点: ${point.lng}, ${point.lat}`);
          break;
        }
      }
    });
  }

  // 初始化
  function init() {
    initWebGL();
    setupMapListeners();
    setupEventHandling();
  }

  init();
}