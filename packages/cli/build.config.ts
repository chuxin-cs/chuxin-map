import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // 入口文件
  entries: ["src/index"],
  // 每次打包时是否先删除上一次打包的 dist
  clean: true,
  // 输出路径
  outDir: "dist",
  // 生成 .d.ts 文件
  declaration: true,
  // 是否开启 sourcemap
  sourcemap: true,
  // 设置构建生成的文件名为 "index"
  name: "index",

  // rollup 配置
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: "node18",
      minify: true,
    },
  },
});
