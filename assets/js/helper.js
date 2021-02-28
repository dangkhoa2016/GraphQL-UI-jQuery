function SetCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function GetCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function EraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var QueryStringToObject = function (queryString) {
  var obj = {};
  var x = (queryString || '').split("?");
  if (x && x.length > 1) queryString = x[1];
  if (queryString) {
    if (queryString.indexOf("?") === 0) queryString = queryString.slice(1);
    queryString.split("&").map(function (item) {
      var _item$split = item.split("="),
        k = _item$split[0],
        v = _item$split[1];
      return v ? (obj[k] = v) : null;
    });
  }

  return obj;
};


function TruncateLongString(str, n, useWordBoundary) {
  if (!str || str.length <= n) { return str; }
  const subString = str.substr(0, n - 1); // the original check
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + "&hellip;";
};
