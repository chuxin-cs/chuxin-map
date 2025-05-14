// 生成模拟数据（1万点）
export function getData() {
  const points = Array.from({ length: 100000 }, () => ({
    lng: 116.4 + (Math.random() - 0.5) * 0.5,
    lat: 39.9 + (Math.random() - 0.5) * 0.5,
    value: Math.random()
  }));
  return points
}