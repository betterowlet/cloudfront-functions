# CloudFront Functions

这个项目用于开发和管理AWS CloudFront Functions。CloudFront Functions是一个轻量级的边缘计算服务，可以用于修改查看器请求和响应。

## 功能特点

- 在边缘位置执行JavaScript代码
- 修改请求和响应头
- URL重写和重定向
- 基于请求属性的请求路由

## 开发环境设置

```bash
# 安装依赖
npm install

# 运行测试
npm test
```

## 项目结构

```
├── src/           # 源代码目录
├── test/          # 测试文件
├── dist/          # 构建输出目录
└── examples/      # 示例代码
```

## 许可证

ISC