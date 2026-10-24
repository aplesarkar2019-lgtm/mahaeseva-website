(function () {
  var d = document, root = d.documentElement;
  var PHONE_WA = '917620123456';

  /* Language toggle (both languages are in the HTML so Google can read them) */
  var lb = d.getElementById('lang');
  if (lb) lb.addEventListener('click', function () {
    var l = root.className.indexOf('lang-mr') > -1 ? 'en' : 'mr';
    root.className = 'lang-' + l; root.lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
  });

  /* Mobile menu */
  var mb = d.getElementById('menu'), nav = d.getElementById('nav');
  if (mb && nav) mb.addEventListener('click', function () {
    var o = nav.classList.toggle('open');
    mb.setAttribute('aria-expanded', o ? 'true' : 'false');
  });

  /* Service search on listing pages */
  var q = d.getElementById('q');
  if (q) {
    var cards = d.querySelectorAll('.grid .card'), none = d.getElementById('none'), cats = d.querySelectorAll('.cat');
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase(), n = 0;
      cards.forEach(function (c) {
        var hit = !v || (c.getAttribute('data-s') || '').indexOf(v) > -1;
        c.hidden = !hit; if (hit) n++;
      });
      cats.forEach(function (s) { s.hidden = !s.querySelector('.card:not([hidden])'); });
      if (none) none.hidden = n > 0;
    });
  }

  /* Enquiry form */
  var f = d.getElementById('ef');
  if (f) {
    var sv = d.getElementById('sv');
    var pre = new URLSearchParams(location.search).get('s');
    if (pre && sv) sv.value = pre;
    var $ = function (id) { return d.getElementById(id); };
    var msg = function (en, mr) { return mr + ' / ' + en; };
    function waLink() {
      var opt = sv.options[sv.selectedIndex];
      var svc = opt && opt.value ? opt.getAttribute('data-en') : 'your services';
      var t = 'Hello, I am ' + ($('n').value.trim() || 'a customer') + '. I want to enquire about: ' + svc + '.' +
        ($('ms').value.trim() ? ' ' + $('ms').value.trim() : '') +
        ' Please contact me by ' + $('pc').value + ($('m').value ? ' on ' + $('m').value : '') + '.';
      return 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(t);
    }
    var wq = $('wq');
    f.addEventListener('input', function () { if (wq) wq.href = waLink(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('hp').value) return; /* spam trap */
      var n = $('n').value.trim(), m = $('m').value.trim(), s = sv.value, bad = false;
      $('en').textContent = n.length < 2 ? msg('Enter your name.', 'नाव लिहा.') : '';
      $('em').textContent = /^[6-9]\d{9}$/.test(m) ? '' : msg('Enter a valid 10-digit mobile number.', 'योग्य 10 अंकी मोबाईल नंबर लिहा.');
      $('es').textContent = s ? '' : msg('Select a service.', 'सेवा निवडा.');
      if (n.length < 2 || !/^[6-9]\d{9}$/.test(m) || !s) return;
      try {
        var a = JSON.parse(localStorage.getItem('enq') || '[]');
        a.push({ n: n, m: m, s: s, msg: $('ms').value.trim(), pc: $('pc').value, at: new Date().toISOString() });
        localStorage.setItem('enq', JSON.stringify(a));
      } catch (x) {}
      var box = $('fm'); box.textContent = '';
      var ok = d.createElement('div'); ok.className = 'ok'; ok.setAttribute('role', 'status');
      var h = d.createElement('h2'); h.textContent = '✅ धन्यवाद / Thank you, ' + n + '!'; ok.appendChild(h);
      var p = d.createElement('p');
      p.textContent = 'तुमची चौकशी तयार आहे. लगेच आमच्यापर्यंत पोहोचवण्यासाठी खालील बटणाने WhatsApp वर पाठवा किंवा कॉल करा. / Your enquiry is ready. To reach us right away, send it on WhatsApp or call us.';
      ok.appendChild(p);
      var r = d.createElement('div'); r.className = 'row';
      var w = d.createElement('a'); w.className = 'btn g'; w.href = waLink(); w.target = '_blank'; w.rel = 'noopener'; w.textContent = 'WhatsApp वर पाठवा / Send on WhatsApp';
      var c = d.createElement('a'); c.className = 'btn o'; c.href = 'tel:+917620123456'; c.textContent = 'कॉल करा / Call Now';
      r.appendChild(w); r.appendChild(c); ok.appendChild(r); box.appendChild(ok);
      ok.setAttribute('tabindex', '-1'); ok.focus();
    });
  }
})();
