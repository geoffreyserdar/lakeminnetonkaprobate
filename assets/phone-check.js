/* Phone check extended from the inline isValidPhone on the probate home form
   (and the same checks in okPhone on the checklist). One copy, used by every lead form.
   Strips formatting and one optional leading 1, then rejects:
   wrong length, area or exchange starting with 0 or 1, N11 area or exchange,
   555-0100 through 555-0199 only, all-identical digits, and clear 10-digit runs.
   234-567-8911 is named on its own: it is not a perfect run, and the old check allowed it. */
(function (root) {
  function normalizePhoneDigits(raw) {
    var d = String(raw == null ? '' : raw).replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d;
  }

  function isN11(three) {
    return three.charAt(0) >= '2' && three.charAt(1) === '1' && three.charAt(2) === '1';
  }

  /* Every step is +1 or every step is -1, wrapping 9/0. A short sequence inside a real number does not match. */
  function isFullRun(d) {
    var asc = true;
    var desc = true;
    var i;
    for (i = 1; i < d.length; i++) {
      var prev = +d.charAt(i - 1);
      var cur = +d.charAt(i);
      if (cur !== (prev + 1) % 10) asc = false;
      if (cur !== (prev + 9) % 10) desc = false;
    }
    return asc || desc;
  }

  function isValidPhone(raw) {
    var d = normalizePhoneDigits(raw);
    if (d.length !== 10) return false;
    if (d.charAt(0) < '2') return false;
    if (d.charAt(3) < '2') return false;
    if (isN11(d.slice(0, 3)) || isN11(d.slice(3, 6))) return false;
    if (d.slice(3, 6) === '555' && d.slice(6, 8) === '01') return false;
    if (/^(\d)\1{9}$/.test(d)) return false;
    if (d === '2345678911') return false;
    if (isFullRun(d)) return false;
    return true;
  }

  var api = { isValidPhone: isValidPhone, normalizePhoneDigits: normalizePhoneDigits };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.isValidPhone = isValidPhone;
  root.normalizePhoneDigits = normalizePhoneDigits;
})(typeof globalThis !== 'undefined' ? globalThis : this);
