# 开发配置说明

**系统名称配置**
   /src/setting 文件夹下, title属性.

**系统环境\请求地址\logo**
	.env.development (开发环境)
	.env.production  (生产环境)
		有几个地址就在这写几个 base api ,然后在utils/request.js 中,配置几个service