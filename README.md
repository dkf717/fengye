# Electron + Vue3 + TS + sqlite3项目搭建

## 基础环境

- node v14.20.1
- npm v6.14.17

## 安装vue-cli

``` ts
$ npm install @vue/cli@5.0.8 -g
// 等待安装完成
$ vue -V
// @vue/cli 5.0.8
```

## 创建vue项目

``` ts
$ vue create project
```

选择自定义配置

``` ts
Vue CLI v5.0.8
? Please pick a preset:
  Default ([Vue 3] babel, eslint)
  Default ([Vue 2] babel, eslint)
> Manually select features
```

选中自己项目需要的配置

``` ts
Vue CLI v5.0.8
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 (*) Babel
 (*) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
 (*) Linter / Formatter
 ( ) Unit Testing
>( ) E2E Testing
```

选择vue 3.x

``` ts
Vue CLI v5.0.8
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, TS, Router, Vuex, CSS Pre-processors, Linter
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
> 3.x
  2.x
```

后面各种配置参考

``` ts
Vue CLI v5.0.8
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, TS, Router, Vuex, CSS Pre-processors, Linter
? Choose a version of Vue.js that you want to start the project with 3.x
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with dart-sass)
? Pick a linter / formatter config: Basic
? Pick additional lint features: Lint on save
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? No
```

开始自动构建

``` ts
Vue CLI v5.0.8
✨  Creating project in ***\project.
🗃  Initializing git repository...
⚙️  Installing CLI plugins. This might take a while...
// 等待项目构建
```

## 集成Electron

``` ts
$ cd project
$ vue add electron-builder
// 等待vue-cli-plugin-electron-builder安装
```

选择13.0.0版本继续

``` ts
? Choose Electron Version (Use arrow keys)
  ^11.0.0
  ^12.0.0
> ^13.0.0
// 等待安装完成
```

## 错误修复1

在```Electron```安装过程中有警告提示

``` ts
 WARN  It is detected that you are using Vue Router. It must function in hash mode to work in Electron. Learn more at https://goo.gl/GM1xZG .
```

大致意思就是 在electron中 vue 只能使用```hash```模式。```history```模式不支持
找到文件目录```src\router\index.ts:1:1```

``` ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 改为
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
```

找到文件目录```src\router\index.ts:20:1```

``` ts
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 改为
const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
  routes
})
```

## 启动项目

``` ts
$ npm run electron:serve
```

## 错误修复2

不出意外的话项目不能正常启动

``` ts
-  Bundling main process...ERROR in src/background.ts:63:56
TS2571: Object is of type 'unknown'.
    61 |       await installExtension(VUEJS3_DEVTOOLS)
    62 |     } catch (e) {
  > 63 |       console.error('Vue Devtools failed to install:', e.toString())
       |                                                        ^
    64 |     }
    65 |   }
    66 |   createWindow()
```

ts规范下模板也逃不过,找到文件```src/background.ts:63:56```

``` ts
try {
  await installExtension(VUEJS3_DEVTOOLS)
} catch (e) {
  console.error('Vue Devtools failed to install:', e.toString())
}
// 改为
try {
  await installExtension(VUEJS3_DEVTOOLS)
} catch (e: any) {
  console.error('Vue Devtools failed to install:', e.toString())
}
```

## 错误修复3

祸不单行，提示方法找不到

``` ts
error  in ./src/background.ts

Module build failed (from ./node_modules/ts-loader/index.js):
TypeError: loaderContext.getOptions is not a function
    at getLoaderOptions (E:\workCode\test\electron2vue3\project\node_modules\ts-loader\dist\index.js:91:41)
    at Object.loader (E:\workCode\test\electron2vue3\project\node_modules\ts-loader\dist\index.js:14:21)

 @ multi ./src/background.ts
```

使用```ts-loader@~8.2.0```

``` ts
$ npm i ts-loader@~8.2.0 -D
```

## 错误修复4

启动过程要等待很长时间，这是因为```installExtension```方法会持续请求安装```VUEJS3_DEVTOOLS```，然后导致项目启动非常慢，必须等它五次请求超时后，才能启动项目

``` ts
INFO  Launching Electron...
Failed to fetch extension, trying 4 more times
Failed to fetch extension, trying 3 more times
Failed to fetch extension, trying 2 more times
Failed to fetch extension, trying 1 more times
Failed to fetch extension, trying 0 more times
Vue Devtools failed to install: Error: net::ERR_CONNECTION_TIMED_OUT
libpng warning: iCCP: cHRM chunk does not match sRGB
```

找到文件```src/background.ts:5:1```

``` ts
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
// 注释掉
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
```

找到文件```src/background.ts:60:5```

``` ts
try {
  await installExtension(VUEJS3_DEVTOOLS)
} catch (e: any) {
  console.error('Vue Devtools failed to install:', e.toString())
}
// 注释掉
// try {
//   await installExtension(VUEJS3_DEVTOOLS)
// } catch (e: any) {
//   console.error('Vue Devtools failed to install:', e.toString())
// }
```

## 错误修复5

如果我们将页面改为```setup```语法糖就会出现以下错误

``` ts
'defineProps' is not defined  no-undef
```

找到文件```.eslintrc.js:4:1```

``` js
// 在env下加入属性
'vue/setup-compiler-macros': true
```

## 安装sqlite3

``` ts
$ npm install sqlite3@5.0.0 -s  
$ npm install @types/sqlite3@3.1.8 -s
```

安装完成后在```src/main.ts:7:1```插入如下代码进行测试

``` ts
import sqlite3 from 'sqlite3'
console.log(sqlite3)
```

## 错误修复6

加入sqlite3测试代码后页面出现数不清的报错，这是因为vue配置中没有添加node支持
找到文件```vue.config.js:4:1```

``` ts
// exports对象中加入配置
pluginOptions:{
  electronBuilder:{
    nodeIntegration:true
  }
}
```
