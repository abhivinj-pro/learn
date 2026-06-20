// Static site builder: converts the Obsidian notes vault into a navigable HTML site.
// Usage:
//   node build.mjs                      -> full build of all sections
//   node build.mjs --sample "A/B.md"    -> assets + sidebar + only the listed page(s) (comma separated)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import mark from 'markdown-it-mark';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import { STYLE, APPJS, widgetWrapper } from './assets.mjs';
import { overrides } from './diagram_overrides.mjs';
import { hashBlock } from './diagram_util.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');          // the vault root (notes/)
const OUT = path.join(ROOT, 'docs');                 // output docs/ (served by GitHub Pages)
const MEDIA_OUT = path.join(OUT, '_media');
const WIDGETS_OUT = path.join(OUT, '_widgets');
const ASSETS_OUT = path.join(OUT, '_assets');

const SECTIONS = [
  'Rapid AI Learning',
  'System Design - LLM based',
  'AI Engineering',
  'Resume`',
  'Companies',
];

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);
const IGNORE_DIRS = new Set(['site', '_site_build', 'node_modules', '.obsidian', '.git', '.trash']);

// ---------- helpers ----------
const stripNum = (s) => s.replace(/^\d+[\.\s_-]+/, '').trim();
const displayName = (s) => stripNum(s.replace(/\.md$/i, ''));

function slugify(s) {
  return String(s)
    .replace(/\$[^$]*\$/g, '')      // strip inline math
    .replace(/[`*_~]/g, '')         // strip emphasis marks
    .trim().toLowerCase()
    .replace(/[^a-z0-9\u00a1-\uffff\s-]/g, '') // keep letters/numbers/space/hyphen
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.') || IGNORE_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

// ---------- image index ----------
const imageIndex = new Map(); // basename(lower) -> absolute path
const htmlIndex = new Map();  // basename(lower) -> absolute path (interactive widgets)
for (const f of walk(ROOT)) {
  const ext = path.extname(f).toLowerCase();
  if (IMG_EXT.has(ext)) imageIndex.set(path.basename(f).toLowerCase(), f);
  else if (ext === '.html' || ext === '.htm') htmlIndex.set(path.basename(f).toLowerCase(), f);
}

// ---------- collect markdown files & build tree ----------
function buildTree(absDir, relParts) {
  const node = { name: path.basename(absDir), relParts, dirs: [], files: [] };
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const e of entries) {
    if (e.isDirectory()) {
      const child = buildTree(path.join(absDir, e.name), [...relParts, e.name]);
      if (child.dirs.length || child.files.length) node.dirs.push(child);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      node.files.push({ name: e.name, relParts: [...relParts, e.name] });
    }
  }
  return node;
}

const sectionTrees = SECTIONS
  .filter((s) => fs.existsSync(path.join(ROOT, s)))
  .map((s) => buildTree(path.join(ROOT, s), [s]));

// ---------- markdown-it setup ----------
const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: false });
md.use(mark);
md.use(texmath, {
  engine: katex,
  delimiters: 'dollars',
  katexOptions: { throwOnError: false, output: 'html', strict: false },
});
md.use(anchor, {
  slugify,
  permalink: anchor.permalink.linkInsideHeader({ symbol: '#', placement: 'before', class: 'h-anchor' }),
});

// Mermaid fences -> <pre class="mermaid">
const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules);
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = (token.info || '').trim().toLowerCase();
  if (info === 'mermaid') {
    env.hasMermaid = true;
    return `<div class="mermaid-wrap"><pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre></div>\n`;
  }
  return defaultFence(tokens, idx, options, env, self);
};

// ---------- Obsidian preprocessing ----------
function stripFrontmatter(src) {
  if (src.startsWith('---')) {
    const end = src.indexOf('\n---', 3);
    if (end !== -1) {
      const after = src.indexOf('\n', end + 1);
      return src.slice(after + 1);
    }
  }
  return src;
}

// ---------- ASCII diagram overrides (website-only; source .md untouched) ----------
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FT_FOLDER_ICO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 4.2c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.5h6.3c.6 0 1.1.5 1.1 1.1v6.6c0 .6-.5 1.1-1.1 1.1H2.6c-.6 0-1.1-.5-1.1-1.1V4.2z"/></svg>';
const FT_FILE_ICO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 1.6h5l3 3v9.3c0 .3-.2.5-.5.5H4c-.3 0-.5-.2-.5-.5V2.1c0-.3.2-.5.5-.5z"/><path d="M9 1.6v3.1h3"/></svg>';

// Render an ASCII directory tree into a styled HTML file tree with icons.
function renderFileTree(content) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\t/g, '    ').split('\n').filter((l) => l.trim() !== '');
  let rows = '';
  for (const line of lines) {
    let main = line;
    let comment = '';
    const cIdx = main.search(/\s+(←|#)/);
    if (cIdx !== -1) { comment = main.slice(cIdx).replace(/^\s+/, ''); main = main.slice(0, cIdx); }
    const conn = main.match(/(├──|└──)\s?/);
    let depth, label;
    if (conn) {
      const ci = main.indexOf(conn[1]);
      depth = Math.round(ci / 4) + 1;
      label = main.slice(ci + conn[0].length).trim();
    } else {
      depth = 0;
      label = main.trim();
    }
    if (!label) continue;
    const isFolder = label.endsWith('/');
    const ico = isFolder ? FT_FOLDER_ICO : FT_FILE_ICO;
    const cls = isFolder ? 'ft-folder' : 'ft-file';
    const indent = '<span class="ft-indent" style="width:' + depth * 20 + 'px"></span>';
    const cmt = comment ? '<span class="ft-comment">' + escHtml(comment) + '</span>' : '';
    rows += '<div class="ft-row ' + cls + '" style="--d:' + depth + '">' + indent +
      '<span class="ft-ico">' + ico + '</span><span class="ft-name">' + escHtml(label) + '</span>' + cmt + '</div>\n';
  }
  return '<div class="filetree">\n' + rows + '</div>';
}

function renderOverride(ov, original) {
  if (ov.type === 'mermaid') return '\n\n```mermaid\n' + ov.code + '\n```\n\n';
  if (ov.type === 'math' || ov.type === 'table') return '\n\n' + ov.code + '\n\n';
  if (ov.type === 'filetree') return '\n\n' + renderFileTree(original) + '\n\n';
  return original;
}

// Swap fenced ASCII-art blocks for their override form (matched by content hash).
function applyDiagramOverrides(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inFence = false, buf = [], fenceLine = '';
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) {
      if (!inFence) { inFence = true; buf = []; fenceLine = lines[i]; }
      else {
        inFence = false;
        const content = buf.join('\n');
        const ov = overrides[hashBlock(content)];
        if (ov) out.push(renderOverride(ov, content));
        else { out.push(fenceLine); for (const b of buf) out.push(b); out.push(lines[i]); }
      }
      continue;
    }
    if (inFence) buf.push(lines[i]);
    else out.push(lines[i]);
  }
  if (inFence) { out.push(fenceLine); for (const b of buf) out.push(b); }
  return out.join('\n');
}

// Build a basename(lower, no ext) -> { relParts } index of all md pages for [[Page]] links.
const pageIndex = new Map();
(function indexPages(node) {
  for (const f of node.files) pageIndex.set(f.name.replace(/\.md$/i, '').toLowerCase(), f.relParts);
  for (const d of node.dirs) indexPages(d);
})({ files: [], dirs: sectionTrees });

function relHref(fromRelParts, toRelParts) {
  // fromRelParts: parts of current page incl filename; toRelParts: target page parts incl filename
  const fromDir = fromRelParts.slice(0, -1);
  const toDir = toRelParts.slice(0, -1);
  let i = 0;
  while (i < fromDir.length && i < toDir.length && fromDir[i] === toDir[i]) i++;
  const up = fromDir.length - i;
  const down = [...toDir.slice(i), toRelParts[toRelParts.length - 1].replace(/\.md$/i, '.html')];
  const parts = [...Array(up).fill('..'), ...down];
  return parts.map(encodeURIComponent).join('/');
}

function preprocess(src, curRelParts, rootPrefix) {
  let s = stripFrontmatter(src);
  s = applyDiagramOverrides(s);

  // Embeds: ![[name|opt]] -> image OR interactive html widget (by extension)
  s = s.replace(/!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (m, name, opt) => {
    const base = name.trim().split('/').pop();
    const ext = path.extname(base).toLowerCase();

    // Interactive HTML widget embed
    if (ext === '.html' || ext === '.htm') {
      const found = htmlIndex.get(base.toLowerCase());
      if (found) {
        const widgetName = ensureWidget(found);
        const url = rootPrefix + '_widgets/' + encodeURIComponent(widgetName);
        let h = '';
        if (opt) { const num = parseInt(opt, 10); if (!Number.isNaN(num)) h = ` style="height:${num}px"`; }
        return `<div class="widget-embed"><iframe class="widget-frame" data-widget="${url}" title="${md.utils.escapeHtml(displayName(base))}" loading="lazy"${h}></iframe><div class="widget-tag">Interactive · ${md.utils.escapeHtml(displayName(base))}</div></div>`;
      }
      return `<span class="img-missing" title="missing widget">⊘ ${md.utils.escapeHtml(base)}</span>`;
    }

    // Image embed
    const found = imageIndex.get(base.toLowerCase());
    let w = '';
    if (opt) {
      const num = parseInt(opt, 10);
      if (!Number.isNaN(num)) w = ` style="width:${num}px;max-width:100%"`;
    }
    if (found) {
      const url = rootPrefix + '_media/' + encodeURIComponent(path.basename(found));
      return `<figure class="md-figure"><img class="md-img" src="${url}" alt="${md.utils.escapeHtml(base)}"${w} loading="lazy"></figure>`;
    }
    return `<span class="img-missing" title="missing image">⊘ ${md.utils.escapeHtml(base)}</span>`;
  });

  // Wikilinks: [[#anchor|alias]], [[#a#b|alias]], [[Page|alias]], [[Page]]
  s = s.replace(/(?<!\!)\[\[([^\]]+?)\]\]/g, (m, inner) => {
    let target = inner, alias = inner;
    const pipe = inner.indexOf('|');
    if (pipe !== -1) { target = inner.slice(0, pipe); alias = inner.slice(pipe + 1); }
    target = target.trim();
    if (target.startsWith('#')) {
      const seg = target.replace(/^#+/, '').split('#').pop();
      return `[${alias}](#${slugify(seg)})`;
    }
    // page link
    const key = target.split('#')[0].split('/').pop().toLowerCase();
    const dest = pageIndex.get(key);
    if (dest) return `[${alias}](${relHref(curRelParts, dest)})`;
    return alias; // unresolved -> plain text, no broken link
  });

  return s;
}

// ---------- TOC extraction (h2/h3) ----------
function extractToc(srcAfterPre) {
  const tokens = md.parse(srcAfterPre, {});
  const toc = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'heading_open' && (t.tag === 'h2' || t.tag === 'h3')) {
      const inline = tokens[i + 1];
      const text = inline.children
        .filter((c) => c.type === 'text' || c.type === 'code_inline')
        .map((c) => c.content).join('').trim();
      if (text) toc.push({ level: t.tag === 'h2' ? 2 : 3, text, slug: slugify(text) });
    }
  }
  return toc;
}

// ---------- sidebar ----------
function sidebarTree(node, rootPrefix, curRelKey, depth = 0) {
  let html = '';
  for (const d of node.dirs) {
    const dirKey = d.relParts.join('/');
    const open = curRelKey.startsWith(dirKey) ? ' open' : '';
    const idxHref = rootPrefix + d.relParts.map(encodeURIComponent).join('/') + '/index.html';
    html += `<li class="nav-folder${open ? ' is-open' : ''}">`;
    html += `<div class="nav-folder-head"><button class="nav-caret" aria-label="toggle">▸</button>`;
    html += `<a href="${idxHref}">${escapeHtml(stripNum(d.name))}</a></div>`;
    html += `<ul class="nav-children">${sidebarTree(d, rootPrefix, curRelKey, depth + 1)}</ul>`;
    html += `</li>`;
  }
  for (const f of node.files) {
    const fileKey = f.relParts.join('/');
    const href = rootPrefix + f.relParts.map((p, i) =>
      i === f.relParts.length - 1 ? encodeURIComponent(p.replace(/\.md$/i, '.html')) : encodeURIComponent(p)
    ).join('/');
    const active = fileKey === curRelKey ? ' class="active"' : '';
    html += `<li class="nav-file"><a${active} href="${href}">${escapeHtml(displayName(f.name))}</a></li>`;
  }
  return html;
}

function buildSidebar(rootPrefix, curRelKey) {
  let html = `<div class="nav-home"><a href="${rootPrefix}index.html">⌂ &nbsp;The Vault</a></div><ul class="nav-root">`;
  for (const sec of sectionTrees) {
    const secKey = sec.relParts.join('/');
    const open = curRelKey.startsWith(secKey) ? ' is-open' : '';
    const idxHref = rootPrefix + sec.relParts.map(encodeURIComponent).join('/') + '/index.html';
    html += `<li class="nav-section${open}">`;
    html += `<div class="nav-folder-head nav-section-head"><button class="nav-caret" aria-label="toggle">▸</button>`;
    html += `<a href="${idxHref}">${escapeHtml(stripNum(sec.name))}</a></div>`;
    html += `<ul class="nav-children">${sidebarTree(sec, rootPrefix, curRelKey)}</ul></li>`;
  }
  html += `</ul>`;
  return html;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- page template ----------
function pageShell({ title, breadcrumb, body, toc, sidebar, rootPrefix, hasMermaid }) {
  const tocHtml = toc && toc.length
    ? `<nav class="toc"><div class="toc-label">On this page</div><ul>${toc.map((t) =>
        `<li class="lvl-${t.level}"><a href="#${t.slug}">${escapeHtml(t.text)}</a></li>`).join('')}</ul></nav>`
    : '';
  const mermaidScript = hasMermaid
    ? `<script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
        const root = document.documentElement;
        const dark = root.getAttribute('data-theme') === 'dark';
        const cs = getComputedStyle(root);
        const vget = (n) => cs.getPropertyValue(n).trim();
        const palette = ['--c1','--c2','--c3','--c4','--c5','--c6'].map(vget);
        const ink = vget('--ink');
        const line = vget('--line-strong');
        const tint = dark ? '2e' : '24';          // node fill alpha
        const clusterTint = dark ? '17' : '12';    // subgraph fill alpha
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          fontFamily: 'Inter, sans-serif',
          securityLevel: 'loose',
          flowchart: { curve: 'basis', htmlLabels: true, padding: 14, nodeSpacing: 48, rankSpacing: 56, useMaxWidth: true },
          themeVariables: {
            background: 'transparent',
            primaryColor: palette[0] + tint,
            primaryBorderColor: palette[0],
            primaryTextColor: ink,
            secondaryColor: palette[2] + tint,
            tertiaryColor: palette[3] + tint,
            lineColor: line,
            titleColor: ink,
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          }
        });
        const colorize = () => {
          document.querySelectorAll('.mermaid svg').forEach((svg) => {
            svg.querySelectorAll('g.node').forEach((node, i) => {
              const c = palette[i % palette.length];
              node.querySelectorAll('rect, polygon, circle, ellipse, path').forEach((sh) => {
                sh.style.setProperty('fill', c + tint, 'important');
                sh.style.setProperty('stroke', c, 'important');
                sh.style.setProperty('stroke-width', '1.5px', 'important');
              });
              node.querySelectorAll('.nodeLabel, .label, span, p, foreignObject div').forEach((t) => {
                t.style.setProperty('color', ink, 'important');
              });
            });
            svg.querySelectorAll('g.cluster rect').forEach((r, i) => {
              const c = palette[(i + 1) % palette.length];
              r.style.setProperty('fill', c + clusterTint, 'important');
              r.style.setProperty('stroke', c, 'important');
            });
            // sequence-diagram actor boxes (top + bottom kept in sync by order)
            ['.actor-top', '.actor-bottom'].forEach((sel) => {
              const boxes = svg.querySelectorAll('rect' + sel);
              const list = boxes.length ? boxes : (sel === '.actor-top' ? svg.querySelectorAll('rect.actor') : []);
              list.forEach((r, i) => {
                const c = palette[i % palette.length];
                r.style.setProperty('fill', c + tint, 'important');
                r.style.setProperty('stroke', c, 'important');
              });
            });
            svg.querySelectorAll('text.actor, .actor > tspan').forEach((t) => {
              t.style.setProperty('fill', ink, 'important');
            });
          });
        };
        await mermaid.run({ querySelector: '.mermaid' });
        colorize();
        window.__mermaid = mermaid;
      </script>` : '';
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)} — The Vault</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${rootPrefix}_assets/katex/katex.min.css" />
<link rel="stylesheet" href="${rootPrefix}_assets/style.css" />
</head>
<body>
<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu">☰</button>
<div class="layout">
  <aside class="sidebar" id="sidebar">${sidebar}</aside>
  <div class="sidebar-scrim" id="scrim"></div>
  <main class="content">
    <div class="topbar">
      <nav class="crumbs">${breadcrumb}</nav>
      <div class="topbar-actions">
        <button class="act-btn" id="focusBtn" aria-label="Toggle focus mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4"/></svg><span id="focusLbl">Focus</span></button>
        <button class="toggle" id="themeBtn" aria-label="Toggle colour scheme"><span class="sw"></span><span id="themeLbl">Light</span></button>
      </div>
    </div>
    <article class="doc">
      <header class="doc-head">
        <div class="kicker"><span class="kicker-line"></span>Entry</div>
        <h1 class="doc-title">${escapeHtml(title)}</h1>
      </header>
      <div class="doc-grid">
        <div class="doc-body">${body}</div>
        ${tocHtml}
      </div>
    </article>
    <footer class="doc-foot">
      <span class="a">The Vault</span>
      <span class="b">Compiled from Obsidian · KaTeX · Mermaid</span>
    </footer>
  </main>
</div>
<script src="${rootPrefix}_assets/app.js"></script>
${mermaidScript}
</body>
</html>`;
}

function breadcrumbHtml(relParts, rootPrefix, isIndex) {
  const crumbs = [`<a href="${rootPrefix}index.html">The Vault</a>`];
  let acc = [];
  const upto = isIndex ? relParts.length : relParts.length - 1;
  for (let i = 0; i < relParts.length; i++) {
    acc = relParts.slice(0, i + 1);
    const isLast = i === relParts.length - 1;
    const label = escapeHtml(displayName(relParts[i]));
    if (isLast && !isIndex) {
      crumbs.push(`<span>${label}</span>`);
    } else {
      const href = rootPrefix + acc.map(encodeURIComponent).join('/') + '/index.html';
      crumbs.push(`<a href="${href}">${label}</a>`);
    }
  }
  return crumbs.join('<span class="sep">/</span>');
}

// ---------- render one markdown page ----------
function renderPage(relParts) {
  const abs = path.join(ROOT, ...relParts);
  const src = fs.readFileSync(abs, 'utf8');
  const depth = relParts.length - 1;
  const rootPrefix = '../'.repeat(depth);
  const pre = preprocess(src, relParts, rootPrefix);
  const env = {};
  const bodyHtml = md.render(pre, env);
  const toc = extractToc(pre);
  const title = displayName(relParts[relParts.length - 1]);
  const sidebar = buildSidebar(rootPrefix, relParts.join('/'));
  const html = pageShell({
    title,
    breadcrumb: breadcrumbHtml(relParts, rootPrefix, false),
    body: bodyHtml,
    toc,
    sidebar,
    rootPrefix,
    hasMermaid: !!env.hasMermaid,
  });
  const outPath = path.join(OUT, ...relParts).replace(/\.md$/i, '.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

// ---------- render section/folder index ----------
function renderIndex(node) {
  const relParts = node.relParts;
  const depth = relParts.length;
  const rootPrefix = '../'.repeat(depth);
  const title = stripNum(node.name);
  const sidebar = buildSidebar(rootPrefix, relParts.join('/'));

  const rows = [];
  let n = 1;
  for (const d of node.dirs) {
    const href = encodeURIComponent(d.name) + '/index.html';
    const count = countEntries(d);
    rows.push(indexRow(n++, stripNum(d.name), `${count} ${count === 1 ? 'entry' : 'entries'} · collection`, href, true));
  }
  for (const f of node.files) {
    const href = encodeURIComponent(f.name.replace(/\.md$/i, '.html'));
    rows.push(indexRow(n++, displayName(f.name), 'Note', href, false));
  }

  const body = `<nav class="index-list">${rows.join('')}</nav>`;
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)} — The Vault</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${rootPrefix}_assets/style.css" />
</head>
<body>
<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu">☰</button>
<div class="layout">
  <aside class="sidebar" id="sidebar">${sidebar}</aside>
  <div class="sidebar-scrim" id="scrim"></div>
  <main class="content">
    <div class="topbar">
      <nav class="crumbs">${breadcrumbHtml(relParts, rootPrefix, true)}</nav>
      <div class="topbar-actions">
        <button class="act-btn" id="focusBtn" aria-label="Toggle focus mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4"/></svg><span id="focusLbl">Focus</span></button>
        <button class="toggle" id="themeBtn" aria-label="Toggle colour scheme"><span class="sw"></span><span id="themeLbl">Light</span></button>
      </div>
    </div>
    <article class="doc">
      <header class="doc-head section-head">
        <div class="kicker"><span class="kicker-line"></span>Collection</div>
        <h1 class="doc-title">${escapeHtml(title)}</h1>
      </header>
      ${body}
    </article>
    <footer class="doc-foot">
      <span class="a">The Vault</span>
      <span class="b">Compiled from Obsidian · KaTeX · Mermaid</span>
    </footer>
  </main>
</div>
<script src="${rootPrefix}_assets/app.js"></script>
</body>
</html>`;
  const outPath = path.join(OUT, ...relParts, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

function countEntries(node) {
  let c = node.files.length;
  for (const d of node.dirs) c += countEntries(d);
  return c;
}

function indexRow(n, title, meta, href, isFolder) {
  const num = String(n).padStart(2, '0');
  const ico = isFolder
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h9l5 5v13a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0z"/><path d="M14 3v6h6"/></svg>`;
  return `<a class="index-row" href="${href}">
    <span class="ir-num">${num}</span>
    <span class="ir-ico">${ico}</span>
    <span class="ir-body"><span class="ir-title">${escapeHtml(title)}</span><span class="ir-meta">${escapeHtml(meta)}</span></span>
    <span class="ir-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
  </a>`;
}

// ---------- assets ----------
function copyAssets() {
  fs.mkdirSync(ASSETS_OUT, { recursive: true });
  // KaTeX css + fonts
  const katexDist = path.join(__dirname, 'node_modules', 'katex', 'dist');
  const katexOut = path.join(ASSETS_OUT, 'katex');
  fs.mkdirSync(path.join(katexOut, 'fonts'), { recursive: true });
  fs.copyFileSync(path.join(katexDist, 'katex.min.css'), path.join(katexOut, 'katex.min.css'));
  for (const f of fs.readdirSync(path.join(katexDist, 'fonts'))) {
    fs.copyFileSync(path.join(katexDist, 'fonts', f), path.join(katexOut, 'fonts', f));
  }
  fs.writeFileSync(path.join(ASSETS_OUT, 'style.css'), STYLE, 'utf8');
  fs.writeFileSync(path.join(ASSETS_OUT, 'app.js'), APPJS, 'utf8');
}

function copyMedia() {
  fs.mkdirSync(MEDIA_OUT, { recursive: true });
  for (const abs of imageIndex.values()) {
    fs.copyFileSync(abs, path.join(MEDIA_OUT, path.basename(abs)));
  }
}

// Wrap an interactive HTML fragment in a themed, auto-resizing document.
const processedWidgets = new Set();
function ensureWidget(absHtmlPath) {
  const name = path.basename(absHtmlPath);
  if (!processedWidgets.has(name)) {
    const fragment = fs.readFileSync(absHtmlPath, 'utf8');
    fs.mkdirSync(WIDGETS_OUT, { recursive: true });
    fs.writeFileSync(path.join(WIDGETS_OUT, name), widgetWrapper(fragment), 'utf8');
    processedWidgets.add(name);
  }
  return name;
}

// ---------- drivers ----------
function allPages(node, acc = []) {
  for (const f of node.files) acc.push(f.relParts);
  for (const d of node.dirs) allPages(d, acc);
  return acc;
}
function allIndexes(node, acc = []) {
  acc.push(node);
  for (const d of node.dirs) allIndexes(d, acc);
  return acc;
}

const args = process.argv.slice(2);
const sampleIdx = args.indexOf('--sample');

copyAssets();
copyMedia();

if (sampleIdx !== -1) {
  const targets = args[sampleIdx + 1].split(',').map((s) => s.trim()).filter(Boolean);
  for (const t of targets) {
    const relParts = t.split(/[\\/]/);
    const out = renderPage(relParts);
    console.log('sample ->', path.relative(ROOT, out));
  }
  // also render the section index for context navigation
  for (const sec of sectionTrees) renderIndex(sec);
  console.log('sample build complete');
} else {
  let pages = 0, idxs = 0;
  for (const sec of sectionTrees) {
    for (const rel of allPages(sec)) { renderPage(rel); pages++; }
    for (const node of allIndexes(sec)) { renderIndex(node); idxs++; }
  }
  console.log(`full build complete: ${pages} pages, ${idxs} index pages`);
}
