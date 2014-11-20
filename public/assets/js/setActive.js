function setActiveMenu(menuName) {

    var elem = document.getElementById('navbar');
    console.log('menuName ' + menuName + ' element = ' + elem.firstChild.firstChild);

    var a = elem.firstChild.getElementsByTagName('li');

    for(var i = 0; i < a.length; i++)
      if(a[i].id == menuName) 
        a[i].className = 'active'
      else 
        a[i].className = '';
}

