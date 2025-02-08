const Koa = require('koa');
const Router = require('koa-router');
const render = require('koa-ejs');
const path = require('path');
const serve = require('koa-static');
const { Reader } = require('@maxmind/geoip2-node');

const app = new Koa();
const router = new Router();

// 配置静态文件服务
app.use(serve(path.join(__dirname, 'views')));

// 配置EJS模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false
});

// 语言检测中间件
async function detectLanguage(ctx, next) {
  // 1. 首先检查cookie
  const cookieLang = ctx.cookies.get('lang');
  if (cookieLang && ['cn', 'en', 'jp'].includes(cookieLang)) {
    ctx.state.lang = cookieLang;
    return next();
  }

  // 2. 根据IP判断地区
  const ip = ctx.ip;
  // 这里简化处理，实际项目中应该使用GeoIP数据库
  if (ip.startsWith('192.168.') || ip.startsWith('127.')) {
    ctx.state.lang = 'en'; // 本地IP默认使用英语
  } else {
    // 这里应该根据实际IP查询地区，现在先使用默认值
    ctx.state.lang = 'en';
  }

  await next();
}

// 应用语言检测中间件
app.use(detectLanguage);

// 处理语言设置和重定向的通用函数
async function handleLanguage(ctx, currentLang) {
  const urlLang = ctx.query.lang;
  const cookieLang = ctx.cookies.get('lang');

  // 处理Cookie中的语言设置
  if (cookieLang && cookieLang !== currentLang) {
    return ctx.redirect(cookieLang === 'en' ? '/' : `/${cookieLang}`);
  }

  return false;
}

// 路由处理
router.get('/', async (ctx) => {
  const shouldRedirect = await handleLanguage(ctx, 'en');
  if (shouldRedirect) return;

  await ctx.render('index', {
    lang: 'en',
    headers: ctx.headers
  });
});

router.get('/cn', async (ctx) => {
  const shouldRedirect = await handleLanguage(ctx, 'cn');
  if (shouldRedirect) return;

  await ctx.render('index', {
    lang: 'cn',
    headers: ctx.headers
  });
});

router.get('/jp', async (ctx) => {
  const shouldRedirect = await handleLanguage(ctx, 'jp');
  if (shouldRedirect) return;

  await ctx.render('index', {
    lang: 'jp',
    headers: ctx.headers
  });
});

// API路由：返回请求头信息
router.get('/api/headers', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = {
    headers: ctx.headers
  };
});

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});