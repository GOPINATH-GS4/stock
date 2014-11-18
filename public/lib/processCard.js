var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

document.getElementById('searchText').addEventListener('keydown', checkEnter);
document.getElementById('searchButton').addEventListener('click', searchCtc);

function checkEnter(event) {

    if (event.keyCode === 13)
        searchCtc();
}

function removeElements(elementName) {

    var elem = document.getElementById(elementName);
    while (elem && elem.firstChild)
        elem.removeChild(elem.firstChild);
}

function processModels(search) {
    var cardList = new app.cardList();
    _.each(search, function(data, index) {
        var card = new app.cardView(data);
        card.render(cardList);
    });
};
function addSpinner() {
  var spinner = document.getElementById('spinner');
  var div;
  div = document.createElement('div');
  div.className = 'spinner boxc';
  spinner.appendChild(div);
  for (var i = 1; i <= 12; i++) {
    var d = document.createElement('div');
    d.className = 'bar' + i;
    div.appendChild(d);
  }
}

function searchCtc() {
    removeElements('cardList');
    addSpinner();

    var searchText = document.getElementById('searchText').value;
    var sessionToken = guid();
    HTTPRequest.post('/search', {
        searchText: searchText,
        sessionToken: sessionToken
    }, function(status, headers, content) {

        var data = JSON.parse(content);
        switch (data.status) {
            case 200:
                var searchs = new app.SearchCollection({
                    session_token: sessionToken
                });
                searchs.fetch({
                    reset: true,
                    success: function(e, response) {
                        removeElements('spinner');
                        processModels(response);
                    },
                    error: function(e, response) {
                        removeElements('spinner');
                        console.log('Something went wrong ... ' + JSON.stringify(response));
                    }
                });
                searchs.bind('reset', function() {
                    searchs.each(function(x) {
                    });
                });
        }
    });
}
