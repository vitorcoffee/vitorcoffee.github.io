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
  var ALPHA = 0.85;             // 流星最大透明度（白痕在夜空上需清晰可见）
  var SPEED_MIN = 60;           // 最慢速度（像素/秒）
  var SPEED_MAX = 110;          // 最快速度（像素/秒）
  var TRAIL_MIN = 50;           // 最短尾迹（像素）
  var TRAIL_MAX = 80;           // 最长尾迹（像素）
  var ANGLE_MIN = 0.5;          // 最小划过角度（弧度，约 30°，向右下）
  var ANGLE_MAX = 1.15;         // 最大划过角度（弧度，约 65°）
  var SPAWN_CHANCE = 0.02;      // 每帧生成流星的概率（越大流星越频繁）
  var MAX_METEORS = 9;          // 同屏最大流星数（9-10 颗）
  var LINE_WIDTH = 1.3;         // 流星线宽基础值（CSS 像素；绘制时按 dpr 缩放）
  // 天空渐变：暗色为参考图的深蓝紫夜空，亮色为浅色天空版
  var DARK_SKY = ['#3a3da6', '#5c60c2', '#8b90d8'];
  var LIGHT_SKY = ['#dce6f9', '#e9eefb', '#f4f6fd'];
  var METEOR_RGB = '255, 255, 255'; // 流星统一为白色

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
  var sky = LIGHT_SKY;

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

  // ---------- 天空渐变：主题切换时更换配色 ----------
  function updateThemeColor() {
    sky = LIGHT_SKY;
    if (document.documentElement.classList.contains('dark')) {
      sky = DARK_SKY;
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
      trail: rand(TRAIL_MIN, TRAIL_MAX), // 极短尾迹，仅作细微划痕
      alpha: 0 // 淡入后到达最大透明度
    };
  }

  // 画出一颗流星：白色细线（极短划痕）
  function drawMeteor(m) {
    var tailX = m.x - m.vx * m.trail;
    var tailY = m.y - m.vy * m.trail;
    var grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
    grad.addColorStop(0, 'rgba(' + METEOR_RGB + ', 0)');
    grad.addColorStop(1, 'rgba(' + METEOR_RGB + ', ' + m.alpha.toFixed(4) + ')');
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = LINE_WIDTH * dpr; // dpr 此时已被 resize() 赋值
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // ---------- 主循环：基于时间增量，速度与帧率无关 ----------
  var lastTime = performance.now();
  var skyGrad = null;
  var skyKey = '';

  function skyGradient() {
    var key = sky.join() + '|' + H;
    if (skyKey !== key) {
      skyKey = key;
      skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, sky[0]);
      skyGrad.addColorStop(0.55, sky[1]);
      skyGrad.addColorStop(1, sky[2]);
    }
    return skyGrad;
  }

  function tick(now) {
    var dt = Math.min((now - lastTime) / 1000, 0.05); // 秒；限幅防切页后跳变
    lastTime = now;

    // 稀疏生成：随机延迟启动，保持画面大量留白
    if (meteors.length < MAX_METEORS && Math.random() < SPAWN_CHANCE) {
      meteors.push(newMeteor());
    }

    // 每帧先铺天空渐变，再重绘流星（流星数量极少，开销可忽略）
    ctx.fillStyle = skyGradient();
    ctx.fillRect(0, 0, W, H);

    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.x += m.vx * m.speed * dt;
      m.y += m.vy * m.speed * dt;
      // 淡入淡出：进入画面后淡入到目标透明度，离开后半程逐渐淡出，柔和无闪烁
      var dist = m.x * m.vx + m.y * m.vy; // 沿运动方向的投影距离
      var total = W * m.vx + H * m.vy;
      var t = Math.min(1, Math.max(0, dist / total)); // 0 → 1 的行程进度
      m.alpha = ALPHA * Math.min(1, t * 8) * Math.min(1, (1 - t) * 4);

      // 头部完全离开画面后移除
      if (m.x > W + 50 || m.y > H + 50) {
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
