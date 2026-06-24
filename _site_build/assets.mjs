// Shared CSS and client JS for generated pages, in the homepage's editorial design language.
export const STYLE = String.raw`
:root{
  --paper:#f3f0e9; --paper-2:#ebe7dd; --ink:#1c1a16; --ink-soft:#514c43; --ink-dim:#8a8377;
  --line:#d8d2c5; --line-strong:#c4bdac; --accent:#b4482f; --accent-soft:#c96b52; --hover:#eae5da;
  --code-bg:#ece7dc; --sidebar:#efebe2;
  --c1:#bd472f; --c2:#c2862c; --c3:#5e946a; --c4:#3f82a4; --c5:#8f5b97; --c6:#cf6a45;
}
[data-theme="dark"]{
  --paper:#14130f; --paper-2:#1b1915; --ink:#f0ece2; --ink-soft:#b3ab9b; --ink-dim:#756f62;
  --line:#2c2922; --line-strong:#3a362d; --accent:#e0795c; --accent-soft:#c96b52; --hover:#1f1d17;
  --code-bg:#1d1b16; --sidebar:#100f0c;
  --c1:#e0795c; --c2:#e0a94e; --c3:#86c08e; --c4:#67b0d0; --c5:#c186c8; --c6:#ed8a68;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:'Inter',system-ui,sans-serif;background:var(--paper);color:var(--ink);line-height:1.65;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;transition:background .4s,color .4s}
::selection{background:var(--accent);color:var(--paper)}
a{color:inherit}

/* layout */
.layout{display:grid;grid-template-columns:300px minmax(0,1fr);min-height:100vh}
.sidebar{position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--sidebar);
  border-right:1px solid var(--line);padding:26px 20px 60px;scrollbar-width:thin}
.sidebar::-webkit-scrollbar{width:8px}.sidebar::-webkit-scrollbar-thumb{background:var(--line-strong);border-radius:8px}
.content{min-width:0;max-width:1180px;width:100%;padding:0 56px 80px;margin:0 auto}

/* sidebar nav */
.nav-home{margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--line)}
.nav-home a{font-family:'Fraunces',serif;font-style:italic;font-size:1.15rem;text-decoration:none;letter-spacing:-.01em}
.nav-home a:hover{color:var(--accent)}
.nav-root{list-style:none}
.nav-root>.nav-section{margin-bottom:6px}
.nav-folder-head{display:flex;align-items:center;gap:6px;border-radius:8px;padding:5px 8px;transition:background .2s}
.nav-folder-head:hover{background:var(--hover)}
.nav-section-head>a{font-size:.74rem;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-soft);font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.nav-section-head>a::before{content:"";width:7px;height:7px;border-radius:2px;background:var(--c1);flex:none;transition:transform .2s}
.nav-root>.nav-section:nth-child(6n+2)>.nav-folder-head>a::before{background:var(--c2)}
.nav-root>.nav-section:nth-child(6n+3)>.nav-folder-head>a::before{background:var(--c3)}
.nav-root>.nav-section:nth-child(6n+4)>.nav-folder-head>a::before{background:var(--c4)}
.nav-root>.nav-section:nth-child(6n+5)>.nav-folder-head>a::before{background:var(--c5)}
.nav-root>.nav-section:nth-child(6n)>.nav-folder-head>a::before{background:var(--c6)}
.nav-section-head:hover>a::before{transform:rotate(45deg) scale(1.15)}
.nav-folder-head>a{flex:1;text-decoration:none;font-size:.9rem;color:var(--ink-soft)}
.nav-folder-head>a:hover{color:var(--accent)}
.nav-caret{background:none;border:none;cursor:pointer;color:var(--ink-dim);font-size:.7rem;width:16px;flex-shrink:0;
  transition:transform .2s;line-height:1}
.nav-section.is-open>.nav-folder-head>.nav-caret,.nav-folder.is-open>.nav-folder-head>.nav-caret{transform:rotate(90deg)}
.nav-children{list-style:none;padding-left:14px;margin-left:6px;border-left:1px solid var(--line);display:none}
.nav-section.is-open>.nav-children,.nav-folder.is-open>.nav-children{display:block}
.nav-file a{display:block;text-decoration:none;font-size:.88rem;color:var(--ink-dim);padding:4px 8px;border-radius:7px;
  transition:color .2s,background .2s}
.nav-file a:hover{color:var(--ink);background:var(--hover)}
.nav-file a.active{color:var(--accent);background:var(--hover);font-weight:500}

/* topbar */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:24px 0 22px;
  border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--paper);z-index:20}
.crumbs{font-size:.78rem;color:var(--ink-dim);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.crumbs a{text-decoration:none}.crumbs a:hover{color:var(--accent)}
.crumbs .sep{color:var(--line-strong)}
.crumbs span:not(.sep){color:var(--ink-soft)}
.toggle{background:none;border:none;cursor:pointer;color:var(--ink-soft);font-family:'Inter';font-size:.72rem;
  letter-spacing:.12em;text-transform:uppercase;display:inline-flex;align-items:center;gap:8px}
.toggle:hover{color:var(--accent)}
.toggle .sw{width:30px;height:16px;border:1px solid var(--line-strong);border-radius:999px;position:relative}
.toggle .sw::after{content:"";position:absolute;top:1px;left:1px;width:12px;height:12px;border-radius:50%;
  background:var(--ink-soft);transition:transform .3s,background .3s}
[data-theme="dark"] .toggle .sw::after{transform:translateX(14px);background:var(--accent)}
.topbar-actions{display:flex;align-items:center;gap:16px}
.act-btn{background:none;border:1px solid var(--line-strong);border-radius:999px;cursor:pointer;color:var(--ink-soft);
  font-family:'Inter';font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;display:inline-flex;align-items:center;
  gap:7px;padding:6px 13px;transition:all .25s}
.act-btn svg{width:14px;height:14px}
.act-btn:hover{color:var(--accent);border-color:var(--accent)}
body.focus-mode .act-btn{color:var(--accent);border-color:var(--accent)}

/* doc head */
.doc{padding-top:46px}
.kicker{display:inline-flex;align-items:center;gap:12px;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ink-soft);margin-bottom:20px}
.kicker-line{width:30px;height:1px;background:var(--accent)}
.doc-title{font-family:'Fraunces',serif;font-weight:360;font-size:clamp(2.1rem,4.4vw,3.4rem);line-height:1.04;
  letter-spacing:-.025em;margin-bottom:8px}
.doc-head{margin-bottom:40px;padding-bottom:34px;border-bottom:1px solid var(--line)}

/* doc grid: body + toc rail */
.doc-grid{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:54px;align-items:start}
.toc{position:sticky;top:96px;font-size:.84rem;border-left:1px solid var(--line);padding-left:18px}
.toc-label{font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:12px}
.toc ul{list-style:none}
.toc li{margin:2px 0}
.toc li.lvl-3{padding-left:14px}
.toc a{text-decoration:none;color:var(--ink-dim);display:block;padding:3px 0;line-height:1.35;transition:color .2s}
.toc a:hover,.toc a.active{color:var(--accent)}

/* typography in body */
.doc-body{font-size:1.02rem}
.doc-body h1,.doc-body h2,.doc-body h3,.doc-body h4{font-family:'Fraunces',serif;font-weight:420;letter-spacing:-.018em;
  line-height:1.18;scroll-margin-top:90px;position:relative}
.doc-body h1{font-size:2rem;margin:1.8em 0 .6em}
.doc-body h2{font-size:1.62rem;margin:1.7em 0 .55em;padding-bottom:.28em;border-bottom:1px solid var(--line)}
.doc-body h3{font-size:1.26rem;margin:1.5em 0 .5em}
.doc-body h4{font-size:1.06rem;margin:1.3em 0 .45em;color:var(--ink-soft)}
.doc-body p{margin:0 0 1.05em}
.doc-body ul,.doc-body ol{margin:0 0 1.1em;padding-left:1.4em}
.doc-body li{margin:.32em 0}
.doc-body li::marker{color:var(--accent-soft)}
.doc-body strong{font-weight:600;color:var(--ink)}
.doc-body a{color:var(--accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--accent) 35%,transparent);transition:border-color .2s}
.doc-body a:hover{border-color:var(--accent)}
.doc-body hr{border:none;border-top:1px solid var(--line);margin:2.4em 0}
.doc-body mark{background:color-mix(in srgb,var(--accent) 22%,transparent);color:inherit;padding:.05em .25em;border-radius:3px}
.doc-body blockquote{border-left:3px solid var(--accent);padding:.4em 0 .4em 1.1em;margin:0 0 1.1em;color:var(--ink-soft);font-style:italic}

/* code */
.doc-body code{font-family:'JetBrains Mono',monospace;font-size:.86em;background:var(--code-bg);
  padding:.15em .42em;border-radius:5px;border:1px solid var(--line)}
.doc-body pre{background:var(--code-bg);border:1px solid var(--line);border-radius:12px;padding:18px 20px;
  overflow-x:auto;margin:0 0 1.3em;line-height:1.55}
.doc-body pre code{background:none;border:none;padding:0;font-size:.85rem}

/* tables */
.doc-body table{width:100%;border-collapse:collapse;margin:0 0 1.4em;font-size:.92rem;display:block;overflow-x:auto}
.doc-body thead{border-bottom:2px solid var(--line-strong)}
.doc-body th{text-align:left;font-weight:600;padding:11px 14px;font-size:.76rem;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);white-space:nowrap}
.doc-body td{padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.doc-body tbody tr{transition:background .15s}
.doc-body tbody tr:hover{background:var(--hover)}

/* images / figures */
.md-figure{margin:1.4em 0;text-align:center}
.md-img{max-width:100%;height:auto;border-radius:12px;border:1px solid var(--line);background:#fff}
[data-theme="dark"] .md-img{background:#f4f1ea}
.img-missing{display:inline-block;color:var(--accent);border:1px dashed var(--accent-soft);padding:.2em .55em;border-radius:6px;font-size:.85em}

/* mermaid */
.mermaid-wrap{margin:1.5em 0;padding:22px;background:var(--paper-2);border:1px solid var(--line);border-radius:14px;overflow-x:auto;text-align:center}
.mermaid{font-family:'Inter',sans-serif!important}

/* file tree */
.filetree{margin:1.6em 0;padding:16px 18px;background:var(--paper-2);border:1px solid var(--line);border-radius:14px;
  font-family:'JetBrains Mono','SFMono-Regular',Consolas,monospace;font-size:.85rem;overflow-x:auto}
.ft-row{display:flex;align-items:center;gap:9px;line-height:2;white-space:nowrap;position:relative}
.ft-row::before{content:"";position:absolute;left:calc(var(--d) * 20px - 10px);top:0;bottom:0;width:1px;
  background:var(--line);display:var(--guide,block)}
.ft-indent{flex:none;display:inline-block}
.ft-ico{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center}
.ft-ico svg{width:16px;height:16px}
.ft-folder .ft-ico{color:var(--c2)}
.ft-file .ft-ico{color:var(--ink-dim)}
.ft-name{color:var(--ink)}
.ft-folder .ft-name{color:var(--ink);font-weight:600}
.ft-comment{color:var(--ink-dim);font-style:italic;font-size:.86em;margin-left:.5em}

/* katex */
.katex-display{margin:1.3em 0;overflow-x:auto;overflow-y:hidden;padding:.4em 0}
.katex{font-size:1.05em}

/* anchors */
.h-anchor{position:absolute;left:-1.1em;opacity:0;text-decoration:none;color:var(--accent);font-weight:400;transition:opacity .15s}
.doc-body h1:hover .h-anchor,.doc-body h2:hover .h-anchor,.doc-body h3:hover .h-anchor,.doc-body h4:hover .h-anchor{opacity:.7}

/* section index */
.section-head{margin-bottom:8px}
.index-list{border-top:1px solid var(--line-strong);margin-top:18px}
.index-row{--row-acc:var(--c1);display:grid;grid-template-columns:54px 44px 1fr 44px;align-items:center;gap:22px;padding:22px 14px 22px 4px;
  border-bottom:1px solid var(--line);text-decoration:none;color:inherit;position:relative;
  transition:padding .4s cubic-bezier(.16,1,.3,1),background .3s}
.index-row:nth-child(6n+2){--row-acc:var(--c2)}
.index-row:nth-child(6n+3){--row-acc:var(--c3)}
.index-row:nth-child(6n+4){--row-acc:var(--c4)}
.index-row:nth-child(6n+5){--row-acc:var(--c5)}
.index-row:nth-child(6n){--row-acc:var(--c6)}
.index-row::after{content:"";position:absolute;left:0;bottom:-1px;height:1px;width:0;background:var(--row-acc);transition:width .5s cubic-bezier(.16,1,.3,1)}
.index-row:hover{background:var(--hover);padding-left:20px}
.index-row:hover::after{width:100%}
.ir-num{font-family:'Fraunces',serif;color:var(--ink-dim);font-size:1rem;transition:color .3s}
.index-row:hover .ir-num{color:var(--row-acc)}
.ir-ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:var(--row-acc);
  background:color-mix(in srgb,var(--row-acc) 14%,transparent);border:1px solid color-mix(in srgb,var(--row-acc) 26%,transparent);
  transition:background .35s,color .35s,transform .35s}
.ir-ico svg{width:21px;height:21px}
.index-row:hover .ir-ico{background:var(--row-acc);color:#fff;transform:rotate(-5deg) scale(1.05)}
.ir-title{display:block;font-family:'Fraunces',serif;font-size:1.34rem;font-weight:400;letter-spacing:-.015em;line-height:1.2}
.ir-meta{display:block;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-dim);margin-top:4px}
.ir-go{width:38px;height:38px;border:1px solid var(--line-strong);border-radius:50%;display:grid;place-items:center;color:var(--ink-soft);justify-self:end;transition:all .35s cubic-bezier(.16,1,.3,1)}
.ir-go svg{width:14px;height:14px;transition:transform .35s}
.index-row:hover .ir-go{background:var(--row-acc);border-color:var(--row-acc);color:#fff}
.index-row:hover .ir-go svg{transform:translate(2px,-2px)}

/* footer */
.doc-foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line);
  margin-top:64px;padding-top:30px;flex-wrap:wrap;gap:12px}
.doc-foot .a{font-family:'Fraunces',serif;font-style:italic;font-size:1.05rem}
.doc-foot .b{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim)}

/* interactive widget embeds */
.widget-embed{margin:1.6em 0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--paper-2)}
.widget-frame{width:100%;border:0;display:block;height:520px;background:transparent}
.widget-tag{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);
  padding:8px 16px;border-top:1px solid var(--line);background:var(--paper)}

/* focus mode */
body.focus-mode .layout{grid-template-columns:1fr}
body.focus-mode .sidebar,body.focus-mode .sidebar-scrim,body.focus-mode .sidebar-toggle{display:none}
body.focus-mode .doc-grid{grid-template-columns:minmax(0,1fr)}
body.focus-mode .toc{display:none}
body.focus-mode .content{max-width:860px;padding-left:32px;padding-right:32px}
body.focus-mode .topbar{padding-left:0}
.content,.toc,.doc-grid,.sidebar{transition:max-width .3s ease}

/* mobile */
.sidebar-toggle{display:none;position:fixed;top:16px;left:16px;z-index:60;width:44px;height:44px;border-radius:12px;
  border:1px solid var(--line-strong);background:var(--paper);color:var(--ink);font-size:1.2rem;cursor:pointer}
.sidebar-scrim{display:none}
@media(max-width:1100px){.doc-grid{grid-template-columns:1fr}.toc{display:none}}
@media(max-width:880px){
  .layout{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;z-index:50;width:300px;transform:translateX(-100%);transition:transform .3s}
  body.nav-open .sidebar{transform:translateX(0)}
  body.nav-open .sidebar-scrim{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:40}
  .sidebar-toggle{display:block}
  .content{padding:0 22px 60px}
  .topbar{padding-left:52px}
}

/* ============================================================
   Ad-hoc page components — shared design system for hand-authored
   / externally-generated pages. Scoped under .doc-body so normal
   notes are unaffected. Any page that drops these markup classes
   into .doc-body inherits the editorial palette automatically.
   ============================================================ */
.doc-body{
  --panel:var(--paper-2);--panel-2:var(--paper-2);
  --border:var(--line);--border-soft:var(--line);
  --ink-faint:var(--ink-dim);
  --accent-2:var(--c5);--accent-3:var(--c3);
  --warn:var(--c2);--danger:var(--accent);--ok:var(--c3);
  --client:var(--c4);--server:var(--c5);--http:var(--c3);--native:var(--c2);
  --mono:'JetBrains Mono',monospace;
}
.doc-body .intro-sub{font-size:1.1rem;color:var(--ink-soft);max-width:74ch;margin:0 0 4px}
.doc-body .meta-row{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 6px}
.doc-body .chip{display:inline-flex;align-items:center;gap:7px;font-size:.8rem;background:var(--paper-2);
  border:1px solid var(--line);padding:7px 12px;border-radius:8px;color:var(--ink-soft)}
.doc-body .chip b{color:var(--ink)}
.doc-body .chip .sw{width:9px;height:9px;border-radius:2px;display:inline-block}
.doc-body section{padding:30px 0 4px;border-bottom:1px solid var(--line)}
.doc-body section:last-of-type{border-bottom:none}
.doc-body h2.sec{font-family:'Fraunces',serif;font-weight:420;font-size:1.6rem;letter-spacing:-.018em;
  margin:.2em 0 .45em;display:flex;align-items:center;gap:12px;border-bottom:none;padding-bottom:0}
.doc-body h2.sec .num{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--accent);
  border:1px solid var(--line);padding:3px 9px;border-radius:7px;background:var(--paper-2);font-weight:500}
.doc-body .lead-p{font-size:1.06rem;color:var(--ink)}
.doc-body .mut{color:var(--ink-dim)}
.doc-body hr.soft{border:none;border-top:1px solid var(--line);margin:28px 0}
/* cards */
.doc-body .grid{display:grid;gap:16px;margin:20px 0}
.doc-body .grid.c2{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.doc-body .grid.c3{grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.doc-body .card{border:1px solid var(--line);border-radius:12px;background:var(--paper-2);padding:16px 18px}
.doc-body .card h4{margin:0 0 6px;font-family:'Fraunces',serif;font-weight:420;color:var(--ink)}
.doc-body .card p{margin:0}
.doc-body .card .ic{font-size:22px;line-height:1}
/* steps */
.doc-body ol.steps{counter-reset:s;list-style:none;padding-left:0;margin:16px 0}
.doc-body ol.steps>li{counter-increment:s;position:relative;padding:12px 14px 12px 52px;border:1px solid var(--line);
  border-radius:10px;margin:10px 0;background:var(--paper-2);color:var(--ink-soft)}
.doc-body ol.steps>li::before{content:counter(s);position:absolute;left:12px;top:11px;width:26px;height:26px;
  border-radius:50%;background:var(--accent);color:var(--paper);font-weight:700;font-size:.8rem;
  display:flex;align-items:center;justify-content:center}
.doc-body ol.steps>li b{color:var(--ink)}
/* notes */
.doc-body .note{border:1px solid var(--line);border-left:4px solid var(--accent);background:var(--paper-2);
  padding:14px 18px;border-radius:10px;margin:18px 0}
.doc-body .note>p{margin:6px 0 0}
.doc-body .note.tip{border-left-color:var(--c3)}
.doc-body .note.warn{border-left-color:var(--c2)}
.doc-body .note.key{border-left-color:var(--c5)}
.doc-body .note .tag{font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);font-weight:700}
.doc-body .note.tip .tag{color:var(--c3)}
.doc-body .note.warn .tag{color:var(--c2)}
.doc-body .note.key .tag{color:var(--c5)}
/* tables */
.doc-body .tbl-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;margin:18px 0;background:var(--paper-2)}
.doc-body .tbl-wrap table{margin:0;display:table;width:100%;font-size:.9rem}
.doc-body .tbl-wrap th{background:color-mix(in srgb,var(--ink) 5%,var(--paper-2))}
.doc-body .tbl-wrap td{border-bottom:1px solid var(--line)}
/* badges */
.doc-body .badge{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.04em;padding:2.5px 8px;
  border-radius:6px;text-transform:uppercase;border:1px solid transparent}
.doc-body .b-client{background:color-mix(in srgb,var(--c4) 15%,transparent);color:var(--c4);border-color:color-mix(in srgb,var(--c4) 40%,transparent)}
.doc-body .b-server{background:color-mix(in srgb,var(--c5) 15%,transparent);color:var(--c5);border-color:color-mix(in srgb,var(--c5) 40%,transparent)}
.doc-body .b-http{background:color-mix(in srgb,var(--c3) 16%,transparent);color:var(--c3);border-color:color-mix(in srgb,var(--c3) 42%,transparent)}
.doc-body .b-native{background:color-mix(in srgb,var(--c2) 16%,transparent);color:var(--c2);border-color:color-mix(in srgb,var(--c2) 42%,transparent)}
.doc-body .b-yes{background:color-mix(in srgb,var(--c3) 16%,transparent);color:var(--c3);border-color:color-mix(in srgb,var(--c3) 42%,transparent)}
.doc-body .b-no{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);border-color:color-mix(in srgb,var(--accent) 40%,transparent)}
/* code blocks with hand syntax spans */
.doc-body pre{background:var(--code-bg);border:1px solid var(--line);border-radius:12px;padding:16px 18px;
  overflow-x:auto;font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.6;margin:16px 0;color:var(--ink)}
.doc-body pre .c{color:var(--ink-dim)}
.doc-body pre .k{color:var(--c5)}
.doc-body pre .s{color:var(--c3)}
.doc-body pre .f{color:var(--c4)}
.doc-body pre .n{color:var(--accent)}
.doc-body .file{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--ink-dim);margin:14px 0 6px;
  display:flex;align-items:center;gap:7px}
.doc-body .file::before{content:"›";color:var(--accent)}
/* figures (inline svg) */
.doc-body figure{margin:24px 0;border:1px solid var(--line);border-radius:14px;background:var(--paper-2);padding:20px}
.doc-body figure svg{display:block;width:100%;height:auto;border-radius:8px}
.doc-body figcaption{margin-top:12px;font-size:.8rem;color:var(--ink-dim);text-align:center}
.doc-body .svg-mono{font-family:'JetBrains Mono',monospace}
/* definition lists */
.doc-body .kvs{display:grid;grid-template-columns:max-content 1fr;gap:6px 18px;font-size:.92rem;margin:14px 0}
.doc-body .kvs dt{color:var(--ink-dim);font-family:'JetBrains Mono',monospace;font-size:.78rem}
.doc-body .kvs dd{margin:0;color:var(--ink-soft)}
/* legend */
.doc-body .pill-legend{display:flex;flex-wrap:wrap;gap:14px;margin:10px 0 4px;font-size:.85rem;color:var(--ink-soft)}
.doc-body .pill-legend span{display:inline-flex;align-items:center;gap:7px}
.doc-body .pill-legend i{width:13px;height:13px;border-radius:3px;display:inline-block}
`;

export const APPJS = String.raw`
(function(){
  var root=document.documentElement;
  var saved=localStorage.getItem('vault-theme');
  if(saved) root.setAttribute('data-theme',saved);
  function syncLbl(){var l=document.getElementById('themeLbl');if(l)l.textContent=root.getAttribute('data-theme')==='dark'?'Dark':'Light';}
  syncLbl();
  var btn=document.getElementById('themeBtn');
  if(btn)btn.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);localStorage.setItem('vault-theme',next);syncLbl();
    updateWidgets(next);
    if(window.__mermaid){location.reload();}
  });
  // focus mode (sticky toggle) — hides sidebar + contents rail
  if(localStorage.getItem('vault-focus')==='1')document.body.classList.add('focus-mode');
  function syncFocus(){var l=document.getElementById('focusLbl');if(l)l.textContent=document.body.classList.contains('focus-mode')?'Exit focus':'Focus';}
  syncFocus();
  var fb=document.getElementById('focusBtn');
  if(fb)fb.addEventListener('click',function(){
    document.body.classList.toggle('focus-mode');
    localStorage.setItem('vault-focus',document.body.classList.contains('focus-mode')?'1':'0');
    syncFocus();
  });
  // interactive widget iframes: theme-synced + auto-height
  var frames=[].slice.call(document.querySelectorAll('.widget-frame[data-widget]'));
  function updateWidgets(theme){
    frames.forEach(function(f){f.src=f.getAttribute('data-widget')+'?theme='+theme;});
  }
  if(frames.length){
    updateWidgets(root.getAttribute('data-theme')||'light');
    window.addEventListener('message',function(e){
      if(e.data&&e.data.type==='vault-widget-height'){
        frames.forEach(function(f){if(f.contentWindow===e.source){f.style.height=(e.data.h+2)+'px';}});
      }
    });
  }
  // mobile sidebar
  var st=document.getElementById('sidebarToggle'),sc=document.getElementById('scrim');
  if(st)st.addEventListener('click',function(){document.body.classList.toggle('nav-open');});
  if(sc)sc.addEventListener('click',function(){document.body.classList.remove('nav-open');});
  // runtime sidebar nav: fetch the single shared partial and inject it.
  // The page declares data-root (relative path to site root) and data-page
  // (its own root-relative href) on #sidebar so the same partial works at
  // every depth and self-highlights the active entry.
  var sb=document.getElementById('sidebar');
  function bindCarets(){
    sb.querySelectorAll('.nav-caret').forEach(function(c){
      c.addEventListener('click',function(e){
        e.preventDefault();
        var li=c.closest('.nav-folder,.nav-section');
        if(li)li.classList.toggle('is-open');
      });
    });
  }
  function markActive(){
    var page=sb.getAttribute('data-page');
    if(!page)return;
    var a=null;
    sb.querySelectorAll('a[href]').forEach(function(l){if(l.getAttribute('href')===page)a=l;});
    if(!a)return;
    a.classList.add('active');
    var el=a;
    while(el&&el!==sb){
      if(el.classList&&(el.classList.contains('nav-folder')||el.classList.contains('nav-section')))el.classList.add('is-open');
      el=el.parentElement;
    }
    a.scrollIntoView({block:'center'});
  }
  if(sb){
    var dataRoot=sb.getAttribute('data-root')||'';
    var navFile=sb.getAttribute('data-nav')||'_assets/nav.html';
    fetch(dataRoot+navFile).then(function(r){return r.text();}).then(function(html){
      sb.innerHTML=html;
      bindCarets();
      markActive();
      // rewrite root-relative hrefs to this page's depth
      sb.querySelectorAll('a[href]').forEach(function(l){l.setAttribute('href',dataRoot+l.getAttribute('href'));});
      sb.removeAttribute('aria-busy');
    }).catch(function(){});
  }
  // scrollspy for TOC
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length){
    var map={};
    var heads=links.map(function(a){var id=decodeURIComponent(a.getAttribute('href').slice(1));var el=document.getElementById(id);if(el)map[id]=a;return el;}).filter(Boolean);
    var obs=new IntersectionObserver(function(ents){
      ents.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.remove('active');});var a=map[en.target.id];if(a)a.classList.add('active');}});
    },{rootMargin:'-80px 0px -70% 0px'});
    heads.forEach(function(h){obs.observe(h);});
  }
})();
`;

// Wraps an interactive HTML fragment in a themed, auto-resizing iframe document.
// Future widgets that use the design tokens below (and prefers-color-scheme) inherit
// the Vault's light/dark theme automatically.
export function widgetWrapper(fragment) {
  return String.raw`<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<script>
(function(){
  var p=new URLSearchParams(location.search);
  var t=(p.get('theme')==='dark')?'dark':'light';
  document.documentElement.setAttribute('data-theme',t);
  var dark=(t==='dark');
  // Make prefers-color-scheme follow the Vault theme so canvas/JS widgets match.
  var real=window.matchMedia?window.matchMedia.bind(window):null;
  window.matchMedia=function(q){
    if(/prefers-color-scheme/i.test(q)){
      var want=/dark/i.test(q)?dark:!dark;
      return {matches:want,media:q,onchange:null,addListener:function(){},removeListener:function(){},
        addEventListener:function(){},removeEventListener:function(){},dispatchEvent:function(){return false;}};
    }
    return real?real(q):{matches:false,media:q,addListener:function(){},removeListener:function(){},
      addEventListener:function(){},removeEventListener:function(){}};
  };
})();
</script>
<style>
  :root{
    --font-mono:'JetBrains Mono',ui-monospace,monospace;
    --color-text-primary:#1c1a16; --color-text-secondary:#514c43; --color-text-tertiary:#8a8377;
    --color-background-primary:#f3f0e9; --color-background-secondary:#ebe7dd; --color-background-tertiary:#e2ddd1;
    --color-border-primary:#c4bdac; --color-border-secondary:#d8d2c5; --color-border-tertiary:#e0dacd;
    --color-accent:#b4482f;
    --color-background-success:#e4efe1; --color-text-success:#2f6b3a;
    --color-background-warning:#f3ead3; --color-text-warning:#8a5e15;
    --color-background-danger:#f3ded8; --color-text-danger:#a3402c;
  }
  [data-theme="dark"]{
    --color-text-primary:#f0ece2; --color-text-secondary:#b3ab9b; --color-text-tertiary:#756f62;
    --color-background-primary:#14130f; --color-background-secondary:#1b1915; --color-background-tertiary:#23211a;
    --color-border-primary:#3a362d; --color-border-secondary:#2c2922; --color-border-tertiary:#2c2922;
    --color-accent:#e0795c;
    --color-background-success:#1c2b1f; --color-text-success:#7bbf86;
    --color-background-warning:#2c2616; --color-text-warning:#d6a94e;
    --color-background-danger:#2e1b17; --color-text-danger:#e89484;
  }
  *{box-sizing:border-box}
  html,body{margin:0;background:transparent}
  body{font-family:'Inter',system-ui,sans-serif;color:var(--color-text-primary);padding:16px 18px;line-height:1.6}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
  h1,h2,h3{font-weight:600;letter-spacing:-.01em;color:var(--color-text-primary)}
  button{font-family:'Inter',sans-serif;font-size:13px;color:var(--color-text-primary);background:var(--color-background-secondary);
    border:1px solid var(--color-border-primary);border-radius:8px;padding:8px 14px;cursor:pointer;transition:all .2s}
  button:hover:not(:disabled){border-color:var(--color-accent);color:var(--color-accent)}
  button:disabled{opacity:.45;cursor:not-allowed}
  select{font-family:'Inter',sans-serif;font-size:13px;color:var(--color-text-primary);background:var(--color-background-secondary);
    border:1px solid var(--color-border-primary);border-radius:8px;padding:9px 12px}
  input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:999px;background:var(--color-border-primary);outline:none}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--color-accent);cursor:pointer;border:2px solid var(--color-background-primary)}
  input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--color-accent);cursor:pointer;border:2px solid var(--color-background-primary)}
  a{color:var(--color-accent)}
</style>
</head>
<body>
${fragment}
<script>
(function(){
  function post(){
    var b=document.body;
    var h=Math.max(b.scrollHeight,b.offsetHeight,b.getBoundingClientRect().height);
    if(window.parent)window.parent.postMessage({type:'vault-widget-height',h:Math.ceil(h)},'*');
  }
  window.addEventListener('load',function(){post();setTimeout(post,250);setTimeout(post,800);});
  if(window.ResizeObserver){new ResizeObserver(post).observe(document.body);}
  window.addEventListener('resize',post);
})();
</script>
</body>
</html>`;
}
