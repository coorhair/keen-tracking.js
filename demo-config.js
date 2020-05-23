module.exports = {
  projectId    : 'ecomsig',
  writeKey     : 'no_required_yet',
  host         : 'localhost:1330',
  protocol     : 'http',
  requestType  : 'json', // nếu dùng jsonp sinh lỗi Cross-Origin Read Blocking (CORB) blocked cross-origin response <url> with MIME type application/json
  // referrerPolicy: 'same-origin', // cách thức sinh Referer HTTP header, tham khảo https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
}
