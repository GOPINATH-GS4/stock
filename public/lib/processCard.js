var rtime;
var timeout = false;
var delta = 200;

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
document.getElementById('newCollection').addEventListener('keydown', checkEnter2);
document.getElementById('searchButton').addEventListener('click', searchCtc);
document.getElementById('createCollection').addEventListener('click', createCollection);

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

function processModels(search) {
    var cardList = new app.cardList();

    _.each(search, function(data, index) {
        var card = new app.cardView(data);
        card.render(cardList);
        var fc = document.getElementById('flowChart');
        if (typeof data.results != 'undefined' &&
            typeof data.results.participant_flow != 'undefined' && data.results.participant_flow != null) {
            var d = getDataForGraphs(data);
            barChart('flowChart', 400, 400, d[0]);
        } else {
            fc.remove();
        }
        fc.setAttribute('id', 'flowChart-' + index);
    });


    // Assign Ids for Drag and Drop to add to collection
    var cardsAddToCollection = document.getElementsByName('addtocollection');
    for (var i = 0; i < cardsAddToCollection.length; i++) {
        cardsAddToCollection[i].setAttribute('id', search[i].nct_id);
    }
};

function getDataForGraphs(data) {

    var periods = data.results.participant_flow.period_list.period;

    var pcharts = [];

    for (var i = 0; i < periods.length; i++) {
        var chart = {};
        chart.chart_title = periods[i].title;

        var milestones = periods[i].milestone_list.milestone;
        chart.milestones = [];
        for (var j = 0; j < milestones.length; j++) {

            var milestone = {};
            milestone.name = milestones[j].title;

            var participants = milestones[j].participants_list.participants;

            milestone.data = [];
            chart.milestones.push(milestone);

            for (var k = 0; k < participants.length; k++) {
                var d = {};
                d.group = participants[k].attributes.group_id;
                d.count = participants[k].attributes.count;
                milestone.data.push(d);
            }
        }
        pcharts.push(chart);
    }
    return pcharts;
}

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