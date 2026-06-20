
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
  // sidebar folder toggles
  document.querySelectorAll('.nav-caret').forEach(function(c){
    c.addEventListener('click',function(e){
      e.preventDefault();
      var li=c.closest('.nav-folder,.nav-section');
      if(li)li.classList.toggle('is-open');
    });
  });
  // mobile sidebar
  var st=document.getElementById('sidebarToggle'),sc=document.getElementById('scrim');
  if(st)st.addEventListener('click',function(){document.body.classList.toggle('nav-open');});
  if(sc)sc.addEventListener('click',function(){document.body.classList.remove('nav-open');});
  // ensure active nav item visible
  var active=document.querySelector('.nav-file a.active');
  if(active)active.scrollIntoView({block:'center'});
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
