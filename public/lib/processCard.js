var rtime;
var timeout = false;
var delta = 200;
var search;
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

//window.addEventListener('resize', redrawParticipantFlowCharts);

document.getElementById('searchText').addEventListener('keydown', checkEnter1);
document.getElementById('searchButton').addEventListener('click', searchCtc);

document.addEventListener('DOMNodeInserted', function(e) {

    /** if (typeof e.target.id != 'undefined' && e.target.id != null && e.target.id.indexOf('chartDiv') === 0 && typeof search != 'undefined') {
        var a = e.target.id.split('-');

        //      renderCharts(search, e.target, a[1], a[2], a[3]);
    }
    ***/
});

function checkEnter1(event) {

    if (event.keyCode === 13)
        searchCtc();
}

function checkEnter2(event) {
    if (event.keyCode === 13)
        createCollection();
}

function removeElements(elementName) {

    var elem = document.getElementById(elementName);
    while (elem && elem.firstChild)
        elem.removeChild(elem.firstChild);
}

function renderCharts(search, element, i1, i2, i3) {

    if (typeof search != 'undefined' && search != null && search.length > 0) {
        var data = search[i1];
        if (typeof data.results != 'undefined' &&
            typeof data.results.participant_flow != 'undefined' && data.results.participant_flow != null) {
            var c = data.charts[i2];
            var x = c.data[i3];
            /*
            console.log(JSON.stringify(c,null,2));
            console.log(JSON.stringify(x,null,2));
            */
            setTimeout(function() {
                console.log('X:' + JSON.stringify(x, null, 5));
                barChartMultipleSeries(element, 'column', 400, 400, x);
            }, 100);
        }
    }
}

function dashBoard(event) {

    console.log('event ' + event.target.id);
    var a = event.target.id.split('-');
    var nct_id = a[0];
    var index = a[1];

    if (typeof search != 'undefined') {
        var nctId = _.findWhere(search, {
            nct_id: nct_id
        });

        if (typeof nctId.charts != 'undefined' && nctId.charts.length > 0) {

            var element = document.getElementById('chartDiv-' + index + '-0-0-' + nct_id);
            if (typeof element != 'undefined' && element != null) {
                var parent = element.parentNode;
                parent.removeChild(element);

                if (typeof nctId.charts != 'undefined' && nctId.charts != null)
                    _.each(nctId.charts, function(chart, i1) {

                        if (typeof chart.data != 'undefined' && chart.data != null)
                            _.each(chart.data, function(d, i2) {
                                var node = document.createElement('div');
                                node.setAttribute("id", 'chartDiv-' + index + '-' + i1 + '-' + i2 + '-' + d.nct_id);
                                parent.appendChild(node);
                                setTimeout(function() {
                                    console.log('D : ' + JSON.stringify(d, null, 5));
                                    barChartMultipleSeries(node, 'column', 400, 400, d);
                                }, 100);
                            });
                    });
            }
        }
    }

}

function processModels(search) {
    this.search = search;
    var cardList = new app.cardList();
    _.each(search, function(data, index) {
        var card = new app.cardView(data);
        card.render(cardList);
        var fc = document.getElementById('flowChart');
        if (typeof data.results != 'undefined' &&
            typeof data.results.participant_flow != 'undefined' && data.results.participant_flow != null) {

            var v = _.findWhere(data.charts, {
                name: 'participant_flow'
            });

            //console.log(JSON.stringify(v, null, 5));
            if (typeof v != 'undefined' && v != null) {
                var node = document.createElement('div');
                node.setAttribute("id", 'chartDiv-' + index + '-0-0-' + data.nct_id);
                fc.appendChild(node);
                if (typeof v.data != 'undefined' && typeof v.data.length != 'undefined' && v.data.length > 0)
                    setTimeout(function() {
                        console.log('V: ' + JSON.stringify(v.data[0], null, 5));
                        barChartMultipleSeries(node, 'column', 400, 400, v.data[0]);
                    }, 100);
            }
        } else {
            fc.remove();
        }
        fc.setAttribute('id', 'flowChart-' + data.nct_id);
    });


    // Assign Ids for Drag and Drop to add to collection
    var cardsAddToCollection = document.getElementsByName('addtocollection');
    for (var i = 0; i < cardsAddToCollection.length; i++) {
        cardsAddToCollection[i].setAttribute('id', search[i].nct_id);
    }
    var dashboards = document.getElementsByName('DashBoard');

    for (var i = 0; i < dashboards.length; i++) {

        dashboards[i].setAttribute('id', search[i].nct_id + '-' + i);
        dashboards[i].addEventListener('click', dashBoard);
    }
};



function redrawParticipantFlowCharts() {
    console.log('Event triigered');
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
}

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        var elements = getElementsStartsWithId('flowChart-');
        for (var i = 0; i < elements.length; i++)
            participantFlowChart(elements[i], {});
    }
}

function addCharts() {}

function drag(ev) {
    ev.dataTransfer.setData("nct_id", ev.target.id);
}

function addSpinner() {
    var spinner = document.getElementById('spinner');
    var div = document.createElement('div');
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
                    }
                });
        }
    });
}


function createCollection() {
    var collectionName = document.getElementById('newCollection').value;

    if (collectionName === null || collectionName === '') return;

    var c = new app.CollectionModel({
        u: user_id,
        collectionName: collectionName
    });
    c.save({
        wait: true
    }, {
        success: function(e, response) {
            removeElements('collection');

            collections.fetch({
                reset: true,
                success: function(e, response) {
                    document.getElementById('newCollection').value = '';
                    processCollectionModels(response);
                },
                error: function(e, response) {
                    console.log(response);
                }
            });
        }
    });
}