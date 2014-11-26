var app = {};

function setCookie(name, value, expires, path, domain) {
    var cookie = name + "=" + escape(value) + ";";

    if (expires) {
        if (expires instanceof Date) {
            if (isNaN(expires.getTime()))
                expires = new Date();
        } else
            expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

        cookie += "expires=" + expires.toGMTString() + ";";
    }

    if (path)
        cookie += "path=" + path + ";";
    if (domain)
        cookie += "domain=" + domain + ";";
    console.log('Set cookie = ' + cookie);
    document.cookie = cookie;
}

function getCookie(name) {

    var x = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(x) != -1) return c.substring(x.length, c.length);
    }
    return "";
}

function deleteCookie(name) {

    var x = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(x) != -1) setCookie(name, '', new Date(), '/');
    }
}