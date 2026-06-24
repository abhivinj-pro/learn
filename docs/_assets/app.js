
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
