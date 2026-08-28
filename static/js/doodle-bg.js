/**
 * doodle-bg.js — 极简流星夜空 Canvas 动态背景
 *
 * 效果：稀疏的流星缓慢划过天际，拖出柔和渐隐的尾迹，划出画面后消失，
 *       随机间隔后新的流星再次划过，循环往复。
 * 特点：无鼠标交互、全自动运行、颜色随亮/暗主题自动适配、
 *       窗口 resize 自适应、纯 Canvas 2D 无依赖、氛围安静柔和。
 */
(function () {
  'use strict';

  // ---------- 可调参数 ----------
  var ALPHA = 0.35;             // 流星最大透明度（半透明，避免干扰阅读）
  var SPEED_MIN = 60;           // 最慢速度（像素/秒）
  var SPEED_MAX = 110;          // 最快速度（像素/秒）
  var TRAIL_MIN = 240;          // 最短尾迹（像素）
  var TRAIL_MAX = 440;          // 最长尾迹（像素）
  var ANGLE_MIN = 0.35;         // 最小划过角度（弧度，约 20°，向右下）
  var ANGLE_MAX = 0.7;          // 最大划过角度（弧度，约 40°）
  var SPAWN_CHANCE = 0.02;      // 每帧生成流星的概率（越大流星越频繁）
  var MAX_METEORS = 5;          // 同屏最大流星数
  var LINE_WIDTH = 4;           // 流星线宽
  var DARK_RGB = '161, 161, 170';   // 暗色模式：低饱和度浅灰 (neutral-400 附近)
  var LIGHT_RGB = '82, 82, 91';     // 亮色模式：低饱和度深灰 (neutral-500 附近)

  // ---------- 画布创建：绝对定位在页面最底层，不遮挡内容 ----------
  var canvas = document.createElement('canvas');
  canvas.id = 'doodle-bg-canvas';
  var style = canvas.style;
  style.position = 'fixed';
  style.top = '0';
  style.left = '0';
  style.width = '100%';
  style.height = '100%';
  style.zIndex = '-1';           // 最底层，位于所有博客内容之下
  style.pointerEvents = 'none';  // 不拦截任何鼠标事件
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, dpr = 1;
  var meteors = [];    // 当前活跃的流星
  var rgb = LIGHT_RGB;

  function rand(min, max) { return min + Math.random() * (max - min); }

  // ---------- 尺寸自适应（含高分屏 dpr） ----------
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- 主题颜色适配：读 html 元素的 .dark 类 ----------
  function updateThemeColor() {
    rgb = LIGHT_RGB;
    if (document.documentElement.classList.contains('dark')) {
      rgb = DARK_RGB;
    }
  }
  // 监听主题切换（Blowfish 切换时会增删 html 上的 .dark 类）
  new MutationObserver(function () {
    updateThemeColor();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // ---------- 生成一颗新的流星 ----------
  // 起点分布在画面上方及左右两侧边缘之外，向右下方缓慢划过
  function newMeteor() {
    var angle = rand(ANGLE_MIN, ANGLE_MAX); // 运动方向（弧度）
    var fromSide = Math.random() < 0.5;
    return {
      x: fromSide ? rand(-150, W * 0.4) : rand(W * 0.1, W * 0.9),
      y: fromSide ? rand(0, H * 0.35) : rand(-150, H * 0.2),
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      speed: rand(SPEED_MIN, SPEED_MAX),
      trail: rand(TRAIL_MIN, TRAIL_MAX),
      alpha: 0 // 淡入后到达最大透明度
    };
  }

  // 画出一颗流星：头部亮、尾部渐隐的柔和线段
  function drawMeteor(m) {
    var tailX = m.x - m.vx * m.trail;
    var tailY = m.y - m.vy * m.trail;
    var grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
    grad.addColorStop(0, 'rgba(' + rgb + ', 0)');
    grad.addColorStop(1, 'rgba(' + rgb + ', ' + m.alpha.toFixed(4) + ')');
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // ---------- 主循环：基于时间增量，速度与帧率无关 ----------
  var lastTime = performance.now();

  function tick(now) {
    var dt = Math.min((now - lastTime) / 1000, 0.05); // 秒；限幅防切页后跳变
    lastTime = now;

    // 稀疏生成：随机延迟启动，保持画面大量留白
    if (meteors.length < MAX_METEORS && Math.random() < SPAWN_CHANCE) {
      meteors.push(newMeteor());
    }

    // 每帧整体清空重绘（流星数量极少，开销可忽略）
    ctx.clearRect(0, 0, W, H);

    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.x += m.vx * m.speed * dt;
      m.y += m.vy * m.speed * dt;
      // 尾部进入画面后淡入到目标透明度，进入后半程逐渐淡出，柔和无闪烁
      var dist = m.x * m.vx + m.y * m.vy; // 沿运动方向的投影距离
      var total = W * m.vx + H * m.vy;
      var t = Math.min(1, Math.max(0, dist / total)); // 0 → 1 的行程进度
      m.alpha = ALPHA * Math.min(1, t * 8) * Math.min(1, (1 - t) * 4);

      // 头部完全离开画面（含尾迹余量）后移除
      if (m.x - m.vx * m.trail > W + 50 || m.y - m.vy * m.trail > H + 50) {
        meteors.splice(i, 1);
        continue;
      }
      drawMeteor(m);
    }

    requestAnimationFrame(tick);
  }

  // 窗口大小变化：防抖后重设画布
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // ---------- 启动 ----------
  updateThemeColor();
  resize();
  requestAnimationFrame(tick);
})();
