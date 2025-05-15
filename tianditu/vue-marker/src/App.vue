<script setup lang="ts">
import { onMounted } from "vue"
import { batchCreateMarker } from "./marker/batch.ts"
import { optimizedCreateMarker } from "./marker/canvas.ts"
import { webglCreateMarker } from "./marker/webgl.ts"

onMounted(() => {
  // marker ==========================
  let num = 3;
  // 队列渲染方案
  if (num === 1) {
    return batchCreateMarker();
  }
  // canvas 方案
  if (num === 2) {
    return optimizedCreateMarker();
  }
  // webgl 
  if(num === 3){
    return webglCreateMarker();
  }
})
</script>

<template>
  <div class="map-container">
    <div style="height: 10vh;">
      <a href="http://lbs.tianditu.gov.cn/api/js4.0/guide.html">天地图</a>
    </div>

    <div class="map" id="mapDiv"></div>
  </div>
</template>
