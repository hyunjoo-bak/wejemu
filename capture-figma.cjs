/**
 * capture-figma.cjs
 * 실행: node capture-figma.cjs
 *
 * 결과:
 *   figma-export/plugin/manifest.json  ← Figma 플러그인 메니페스트
 *   figma-export/plugin/code.js        ← 플러그인 실행 코드 (페이지 데이터 포함)
 *   figma-export/plugin/ui.html        ← 플러그인 UI
 *
 * Figma 사용법:
 *   1. Figma 데스크탑 앱 > 왼쪽 상단 로고 > Plugins > Development > Import plugin from manifest
 *   2. figma-export/plugin/manifest.json 선택
 *   3. 플러그인 실행 → "모든 페이지 생성" 클릭
 *   4. 8개 프레임이 편집 가능한 레이어 구조로 생성됨
 */

const puppeteer = require('puppeteer-core');
const fs   = require('fs');
const path = require('path');

const BASE_URL    = 'http://localhost:5174';
const OUT_DIR     = path.join(__dirname, 'figma-export');
const PLUGIN_DIR  = path.join(OUT_DIR, 'plugin');

const PAGES = [
  { name: '01 로그인',           route: '/login',               auth: false },
  { name: '02 사업장현황',       route: '/business/status',     auth: true  },
  { name: '03 사업장관리자계정', route: '/business/accounts',   auth: true  },
  { name: '04 로그인이력',       route: '/business/login-log',  auth: true  },
  { name: '05 ERP메뉴로그',      route: '/logs/erp-menu',       auth: true  },
  { name: '06 마스터계정',       route: '/admin/master',        auth: true  },
  { name: '07 가입신청승인',     route: '/admin/approval',      auth: true  },
  { name: '08 권한설정',         route: '/admin/permissions',   auth: true  },
];

const AUTH_USER = {
  id: 1, name: '마스터관리자', email: 'master@erp.kr',
  role: 'master', status: 'active', avatar: 'MA',
};

const VIEWPORT_W = 1440;

// ── DOM 구조 추출 함수 (브라우저 컨텍스트에서 실행) ────────────────────────
function extractPageNodes() {
  const nodes = [];

  // CSS 색상 문자열 → { r, g, b } (0~1 범위)
  function cssToRgb(css) {
    if (!css || css === 'transparent') return null;
    const m = css.match(/rgba?\(\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)/);
    if (m) return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255 };
    if (css.startsWith('#')) {
      const h = css.slice(1);
      const n = parseInt(h.length === 3
        ? h.split('').map(c => c + c).join('') : h, 16);
      return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
    }
    return null;
  }

  // 알파 채널 추출
  function cssAlpha(css) {
    if (!css) return 1;
    const m = css.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)/);
    return m ? parseFloat(m[1]) : 1;
  }

  // 직계 텍스트 내용 추출
  function getDirectText(el) {
    return [...el.childNodes]
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent)
      .join('')
      .trim();
  }

  const processed = new Set();

  function walk(el, depth) {
    if (depth > 12) return;
    if (processed.has(el)) return;
    processed.add(el);

    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    if (rect.bottom < 0) return;

    const st = window.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return;
    if (parseFloat(st.opacity) < 0.01) return;

    const x = Math.round(rect.left);
    const y = Math.round(rect.top);
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    // ── 배경 사각형 ──────────────────────────────────────────────────────────
    const bgColor = cssToRgb(st.backgroundColor);
    const bgAlpha = cssAlpha(st.backgroundColor);
    if (bgColor && bgAlpha > 0.02) {
      nodes.push({
        kind: 'rect',
        x, y, w, h,
        fill: bgColor,
        fillOpacity: bgAlpha,
        radius: parseInt(st.borderRadius) || 0,
        z: depth * 2,
      });
    }

    // ── 테두리 ───────────────────────────────────────────────────────────────
    const bw = parseFloat(st.borderTopWidth) || 0;
    const bc = cssToRgb(st.borderTopColor);
    if (bw >= 0.4 && bc) {
      nodes.push({
        kind: 'border',
        x, y, w, h,
        stroke: bc,
        strokeW: bw,
        radius: parseInt(st.borderRadius) || 0,
        z: depth * 2 + 1,
      });
    }

    // ── 텍스트 노드 ──────────────────────────────────────────────────────────
    const txt = getDirectText(el);
    if (txt) {
      const fg = cssToRgb(st.color) || { r: 0.1, g: 0.1, b: 0.1 };
      const fw = parseInt(st.fontWeight) || 400;
      const fs = Math.round(parseFloat(st.fontSize) || 13);
      const ta = st.textAlign === 'center' ? 'CENTER'
               : st.textAlign === 'right'  ? 'RIGHT' : 'LEFT';
      nodes.push({
        kind: 'text',
        x, y, w, h,
        text: txt,
        fontSize: Math.max(8, Math.min(fs, 72)),
        bold: fw >= 600,
        color: fg,
        align: ta,
        z: depth * 2 + 2,
      });
    }

    // ── 자식 순회 ─────────────────────────────────────────────────────────────
    for (const child of el.children) {
      walk(child, depth + 1);
    }
  }

  walk(document.body, 0);

  // z-order 정렬
  nodes.sort((a, b) => a.z - b.z);

  return {
    width:  Math.max(document.documentElement.scrollWidth, 1440),
    height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    nodes,
  };
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
async function main() {
  [OUT_DIR, PLUGIN_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

  console.log('🚀 Chrome headless 시작...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ko-KR'],
    defaultViewport: { width: VIEWPORT_W, height: 900, deviceScaleFactor: 1 },
  });

  const allPageData = [];

  for (const pg of PAGES) {
    console.log(`🔍 추출: ${pg.name}`);

    const page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_W, height: 900 });

    // 앱 진입 (wejemu 베이스 경로 로드)
    await page.goto(BASE_URL + '/wejemu/', { waitUntil: 'networkidle0' });

    // 인증 세팅
    if (pg.auth) {
      await page.evaluate(u => localStorage.setItem('wejemu_admin_user', JSON.stringify(u)), AUTH_USER);
    } else {
      await page.evaluate(() => localStorage.removeItem('wejemu_admin_user'));
    }

    // React Router SPA 네비게이션
    await page.evaluate(route => {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    }, pg.route);

    await new Promise(r => setTimeout(r, 900));

    // 실제 높이로 뷰포트 확장
    const bodyH = await page.evaluate(() =>
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    await page.setViewport({ width: VIEWPORT_W, height: bodyH });
    await new Promise(r => setTimeout(r, 200));

    // DOM 구조 추출
    const structure = await page.evaluate(extractPageNodes);

    console.log(`   → ${structure.nodes.length}개 노드 (${structure.width}×${structure.height})`);
    allPageData.push({ name: pg.name, ...structure });

    await page.close();
  }

  await browser.close();

  // ── Figma 플러그인 파일 생성 ──────────────────────────────────────────────
  console.log('\n🔧 Figma 플러그인 생성...');
  generatePlugin(allPageData);

  console.log('\n✅ 완료!');
  console.log(`\n📁 플러그인 폴더: ${PLUGIN_DIR}`);
  console.log('\n📌 Figma 설치 방법:');
  console.log('   1. Figma 데스크탑 앱 열기');
  console.log('   2. 왼쪽 상단 로고 클릭 → Plugins → Development → Import plugin from manifest');
  console.log('   3. figma-export/plugin/manifest.json 선택');
  console.log('   4. 플러그인 실행 → "모든 페이지 생성" 버튼 클릭');
  console.log('   → 8개 편집 가능한 프레임 생성됨!');
}

// ── 플러그인 파일 생성 ────────────────────────────────────────────────────────
function generatePlugin(allPageData) {
  // manifest.json
  fs.writeFileSync(path.join(PLUGIN_DIR, 'manifest.json'), JSON.stringify({
    name: 'WEJEMU Admin Importer',
    id:   'wejemu-admin-importer-001',
    api:  '1.0.0',
    main: 'code.js',
    ui:   'ui.html',
    editorType: ['figma'],
  }, null, 2));

  // ui.html
  fs.writeFileSync(path.join(PLUGIN_DIR, 'ui.html'), `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px;
         background: #fff; color: #1a1a1a; }
  h3   { margin: 0 0 8px; font-size: 14px; color: #3C3489; }
  p    { font-size: 12px; color: #666; margin: 0 0 16px; line-height: 1.5; }
  button { width: 100%; padding: 10px; background: #3C3489; color: #fff;
           border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
  button:hover { background: #26215C; }
  #status { margin-top: 12px; font-size: 12px; color: #3C3489; min-height: 20px; }
</style>
</head>
<body>
  <h3>WEJEMU Admin Importer</h3>
  <p>8개 어드민 페이지를 편집 가능한<br>Figma 프레임으로 생성합니다.</p>
  <button id="btn">모든 페이지 생성 (8개 프레임)</button>
  <div id="status"></div>
  <script>
    const btn = document.getElementById('btn');
    const status = document.getElementById('status');
    btn.onclick = () => {
      btn.disabled = true;
      btn.textContent = '생성 중...';
      status.textContent = '프레임을 생성하고 있습니다. 잠시 기다려주세요.';
      parent.postMessage({ pluginMessage: { type: 'create' } }, '*');
    };
    window.onmessage = e => {
      const msg = e.data.pluginMessage;
      if (!msg) return;
      if (msg.type === 'progress') {
        status.textContent = msg.text;
      } else if (msg.type === 'done') {
        btn.textContent = '완료!';
        status.textContent = '✅ ' + msg.text;
      } else if (msg.type === 'error') {
        btn.disabled = false;
        btn.textContent = '모든 페이지 생성 (8개 프레임)';
        status.textContent = '❌ 오류: ' + msg.text;
      }
    };
  </script>
</body>
</html>`);

  // code.js — 페이지 데이터 임베드 + Figma 플러그인 로직
  const dataJson = JSON.stringify(allPageData);

  const codeJs = `// WEJEMU Admin Importer — Figma Plugin
// Auto-generated by capture-figma.cjs

const ALL_PAGES = ${dataJson};

figma.showUI(__html__, { width: 340, height: 220 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'create') return;

  try {
    // 폰트 사전 로드
    const fonts = [
      { family: 'Inter', style: 'Regular' },
      { family: 'Inter', style: 'Medium' },
      { family: 'Inter', style: 'Bold' },
      { family: 'Inter', style: 'Semi Bold' },
    ];
    for (const f of fonts) {
      try { await figma.loadFontAsync(f); } catch (_) {}
    }

    const PAGE_GAP = 120;
    let frameX = 0;

    for (let pi = 0; pi < ALL_PAGES.length; pi++) {
      const pg = ALL_PAGES[pi];

      figma.ui.postMessage({ type: 'progress', text: \`(\${pi + 1}/\${ALL_PAGES.length}) \${pg.name} 생성 중...\` });

      // ── 프레임 생성 ────────────────────────────────────────────────────────
      const frame = figma.createFrame();
      frame.name = pg.name;
      frame.resize(pg.width, pg.height);
      frame.x = frameX;
      frame.y = 0;
      frame.fills = [{ type: 'SOLID', color: { r: 0.969, g: 0.965, b: 0.949 } }]; // #F7F6F2
      frame.clipsContent = true;

      // ── 노드 그룹 생성 ─────────────────────────────────────────────────────
      const rectGroup = figma.createFrame();
      rectGroup.name = '배경/도형';
      rectGroup.resize(pg.width, pg.height);
      rectGroup.fills = [];
      rectGroup.x = 0; rectGroup.y = 0;
      frame.appendChild(rectGroup);

      const textGroup = figma.createFrame();
      textGroup.name = '텍스트';
      textGroup.resize(pg.width, pg.height);
      textGroup.fills = [];
      textGroup.x = 0; textGroup.y = 0;
      frame.appendChild(textGroup);

      // ── 노드 생성 ─────────────────────────────────────────────────────────
      for (const node of pg.nodes) {
        try {
          if (node.kind === 'rect') {
            const rect = figma.createRectangle();
            rect.x = node.x;
            rect.y = node.y;
            rect.resize(Math.max(1, node.w), Math.max(1, node.h));
            rect.fills = [{
              type: 'SOLID',
              color: node.fill,
              opacity: node.fillOpacity != null ? node.fillOpacity : 1,
            }];
            if (node.radius > 0) rect.cornerRadius = Math.min(node.radius, 50);
            rectGroup.appendChild(rect);

          } else if (node.kind === 'border') {
            const rect = figma.createRectangle();
            rect.x = node.x;
            rect.y = node.y;
            rect.resize(Math.max(1, node.w), Math.max(1, node.h));
            rect.fills = [];
            rect.strokes = [{ type: 'SOLID', color: node.stroke }];
            rect.strokeWeight = node.strokeW;
            rect.strokeAlign = 'INSIDE';
            if (node.radius > 0) rect.cornerRadius = Math.min(node.radius, 50);
            rectGroup.appendChild(rect);

          } else if (node.kind === 'text') {
            const t = figma.createText();
            try {
              const style = node.bold ? 'Bold' : 'Regular';
              t.fontName = { family: 'Inter', style };
            } catch (_) {
              t.fontName = { family: 'Inter', style: 'Regular' };
            }
            t.fontSize = node.fontSize;
            t.characters = node.text;
            t.fills = [{ type: 'SOLID', color: node.color }];
            t.textAlignHorizontal = node.align || 'LEFT';
            t.x = node.x;
            t.y = node.y;
            textGroup.appendChild(t);
          }
        } catch (nodeErr) {
          // 개별 노드 오류 무시하고 계속 진행
        }
      }

      figma.currentPage.appendChild(frame);
      frameX += pg.width + PAGE_GAP;
    }

    // 생성된 프레임 전체 보기
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
    figma.ui.postMessage({ type: 'done', text: ALL_PAGES.length + '개 프레임 생성 완료!' });

  } catch (err) {
    figma.ui.postMessage({ type: 'error', text: err.message });
  }
};
`;

  fs.writeFileSync(path.join(PLUGIN_DIR, 'code.js'), codeJs, 'utf-8');

  const stats = {
    pages: allPageData.length,
    totalNodes: allPageData.reduce((s, p) => s + p.nodes.length, 0),
    codeSize: (fs.statSync(path.join(PLUGIN_DIR, 'code.js')).size / 1024).toFixed(0) + ' KB',
  };
  console.log(`   manifest.json, ui.html, code.js 생성 완료`);
  console.log(`   페이지: ${stats.pages}개 | 총 노드: ${stats.totalNodes}개 | code.js: ${stats.codeSize}`);
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  console.error(err.stack);
  process.exit(1);
});
