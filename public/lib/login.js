document.getElementById('passwd').addEventListener('keydown', checkPasswd);

function checkPasswd(event) {

    var passwd = document.getElementById('passwd');

    var re = /\w{6,}/;


    if (!re.test(passwd.value)) passwd.className = 'red';
    else passwd.className = 'blue';
}