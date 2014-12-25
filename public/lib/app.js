var app = {};


function updateCookie() {

    var ctcToken = getCookie('ctcToken');
    var btn = document.getElementById('login-button');

    if (btn.name === 'login') {
        btn.name = 'logout';
        btn.text = 'Logout';
        btn.href = '/signout';
        if (ctcToken != null && ctcToken != "") {
            var dt = new Date();
            dt = new Date(dt.getTime() + 5 * 60 * 1000);
            //dt.setHours(dt.getHours() + 12);
            setCookie('ctcToken', ctcToken, dt);
            setUserCookie(dt);
        } else {
            btn.name = 'login';
            btn.text = 'Log In'
            btn.href = '/signin';
            deleteCookie('ctcToken');
            deleteCookie('ctcUsername');
            deleteCookie('ctcUser_id');
        }
    } else if (btn.name === 'logout') {
        btn.name = 'login';
        btn.text = 'Log In'
        btn.href = '/signin';
        deleteCookie('ctcToken');
        deleteCookie('ctcUsername');
        deleteCookie('ctcUser_id');
    }

}

function setUserCookie(dt) {
    if (typeof username != 'undefined' &&
        username != null &&
        username != "") {
        setCookie('ctcUsername', username, dt, '/');
    }
    if (typeof user_id != 'undefined' &&
        user_id != null &&
        user_id != "") {
        setCookie('ctcUser_id', user_id, dt, '/');
    }
}

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

function getElementsStartsWithId(id) {
    var children = document.body.getElementsByTagName('*');
    var elements = [],
        child;
    for (var i = 0, length = children.length; i < length; i++) {
        child = children[i];
        if (child.id.substr(0, id.length) == id)
            elements.push(child);
    }
    return elements;
}

updateCookie();