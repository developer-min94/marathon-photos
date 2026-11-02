// 배번 검색 로직: 정확히 일치(exact) / 일부만 읽힘·한 글자 차이(maybe)
(function (root) {
  function parse(q) {
    var s = String(q).toUpperCase().replace(/[^A-Z0-9]/g, '');
    var m = s.match(/^([A-Z]?)(\d{1,5})$/);
    return m ? { letter: m[1], digits: m[2] } : null;
  }
  function oneOff(a, b) {
    if (a.length !== b.length) return false;
    var d = 0;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i] && ++d > 1) return false;
    return d === 1;
  }
  function near(read, digits) {
    return read.length >= 4 && (digits.indexOf(read) === 0 || oneOff(read, digits));
  }
  function search(photos, q) {
    var t = parse(q), exact = [], maybe = [];
    if (!t || t.digits.length < 3) return null;
    photos.forEach(function (ph) {
      var rank = 0;
      ph.b.forEach(function (x) {
        var D = x.slice(2);
        if (t.letter && t.letter !== x[0]) return;
        if (D === t.digits) rank = 2;
        else if (!rank && near(D, t.digits)) rank = 1;
      });
      ph.p.forEach(function (D) {
        if (D === t.digits) rank = 2;
        else if (!rank && near(D, t.digits)) rank = 1;
      });
      if (rank === 2) exact.push(ph);
      else if (rank === 1) maybe.push(ph);
    });
    return { exact: exact, maybe: maybe };
  }
  root.BibSearch = { parse: parse, search: search };
  if (typeof module !== 'undefined') module.exports = root.BibSearch;
})(typeof window !== 'undefined' ? window : globalThis);
