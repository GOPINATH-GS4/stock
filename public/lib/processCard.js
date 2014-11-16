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

function removeCards() {

    var cardList = document.getElementById('cardList');
    while (cardList && cardList.firstChild)
        cardList.removeChild(cardList.firstChild);
}

function processModels(search) {
    _.each(search, function(data) {
        var card = new app.cardView('NCTID : ' + data.nct_id);

        for (var i = 0; i < data.condition.length; i++) {
            card.render('<li>' + data.condition[i] + '</li>', '#cardList', 'card');
        }
    });
};

function searchCtc() {
    removeCards();
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
                        processModels(response);
                    },
                    error: function(e, response) {
                        console.log('Something went wrong ... ' + JSON.stringify(response));
                    }
                });
                searchs.bind('reset', function() {
                    searchs.each(function(x) {
                        console.log('x : ' + JSON.stringify(x));
                    });
                });
        }
    });
}
