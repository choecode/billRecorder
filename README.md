# xmind-job

国内推荐访问：https://joker12345.gitee.io

其他推荐访问：https://choecode.github.io


## 依赖安装
```
npm install
```

### 开发环境的编译与热更新
```
npm run serve
```

### 生产环境的编译打包
```
npm run build
```

### 注意
`
推荐在安卓手机的Chrome浏览器或者PC上的Chrome中访问
因为WebSQL在某些平台上已不被支持,当前已知Mac上的safari浏览器、iOS上的safari、iOS上的Chrmoe、iOS上的weixin均无法正常浏览项目
`



## 技术选型
###     数据存储
`WebSQL 应对条件查询有比较好的解决方案（用标准的SQL对数据进行查询和更新）,且不依赖后端服务`
###     远程数据读取
`XMLHttpRequest 轻,且能够让项目不依赖后端服务,直接读取远程静态文件即可`
###      数据处理
`Vue 框架成熟,其"计算属性"可以提高开发效率,其组件化开发,可以在应对复杂交互的情况下分而治之`
###      数据展示
`ElementUI 库成熟,拥有良好的用户交互和呈现效果`

## 本地开发环境
1. Node:v8.16.1

2. Chrome:83.0

3. OS: Windows10 1903、MacOS 10.15.5


## QA
1. 当页面加载的时候,如何确保打开应用的时候,WebSQL中不会出现重复数据

`在搜索引擎中查询到,WebSQL确保不产生重复数据的方案,给bill数据集设定唯一标识,而bill源数据中没有唯一标识,那么可以把AMOUNT+TIME作为唯一标识（严谨性取决于数据和业务）,并且在创建表的时候给字段设定unique标识即可`

2. 如何优化页面打开过慢的问题

`通过webpack-bundle-analyzer对打包后的项目的大小进行分析,发现elementui、moment、jqury相对过大.后面采取了按需加载elementui、使用day.js替换momentjs,使用XMLHttpRequest替代jquery.结果是打包后的文件总大小减小了52%.通过devtools发现,github上的csv在部分网络下会出现无法读取的情况,我采取的方案是在原来的基础上新增一个数据源.`

3. 你将如何应对WebSQL的兼容性

`在测试过程中,发现Mac上的safari浏览器、iOS上的safari、iOS上的Chrmoe、iOS上的weixin均无法打开网页,经过调试后发现,新版本的IOS已经不支持WebSQL,在初始化的时候就报异常.目前的做法是,当发现无法正常产生WebSQL连接的时候,则提示用户更换浏览器使用,当然,这不是一个好的解决方案,我会考虑更换IndexDB或者使用Node来存储数据`

4. 你是如何确保在两个数据源都请求完成的情况下进行合并信息并展示的？

`拉取数据的方法,都采用Promise,然后把合并信息逻辑放置到Promise.all的回调函数中`

5. 你是如何做到时间区间的数据筛选的

`day.js 对源数据中的日期,以及日期选择组件中的结果值进行格式转换,然后通过比较来确定是否是同一个月的数据`

6. 你觉得在部署和构建方面可以做哪些完善

`1. 本地编写gulp脚本,build之后,把build的内容通过git传到github page中`

`2. 本地编写gulp脚本,build之后,把build的内容通过scp传到目标服务器`

`3. 本地编写gulp脚本,以带有nginx服务linux作为基础镜像,serve build之后的文件,然后目标服务器拉取并运行该镜像`

7. 你是如何真机调试的

`安装vconsole插件,并且在weback中配置,只在本地环境中启用,那么在真机上就可以看到类似于devtools上的调试及错误信息了`
