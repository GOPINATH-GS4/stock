module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // search.js
    // Author: Janakiraman Gopinath 
    //
    var request = require('request');
    var search = function(req, res) {

        switch (req.method) {
            case 'POST':
                // 1. make a call to lilly coi 
                // 2. 
                var resp = {
                    status: 200,
                    data: {
                        results: []
                    }
                };
                request.get(
                    'http://api.lillycoi.com/v1/trials/search.json?query=' + req.body.searchText, {},
                    function(error, response, body) {
                        if (error) {
                            var resp = {
                                status: 500,
                                message: error
                            };
                            utils.writeResponse(req, res, response);
                        } else {
                            var data = JSON.parse(body);
                            processResults(data, req.body.sessionToken, req.body.searchText, req, res);
                        }
                    });
                break;
            case 'GET':
                var sessionToken = req.url.split('/').pop();


                ctcModel.Searchs.find(sessionToken === 'search' ? {} : {
                    session_token: sessionToken
                }, function(err, searchs) {
                    var resp = [];

                    utils._.each(searchs, function(search) {
                        utils._.each(search.ctcs, function(ctc) {
                            var response = {};
                            response.charts = [];
                            response.nct_id = ctc.nct_id;
                            response.conditions = ctc.conditions;
                            response.overall_status = ctc.overall_status;
                            response.summary = ctc.summary;
                            response.primary_outcomes = ctc.primary_outcomes;
                            response.secondary_outcomes = ctc.secondary_outcomes;
                            response.clinical_results = ctc.clinical_results;
                            response.results = ctc.results;

                            var c = {};
                            c.name = 'participant_flow';
                            c.data = ctc.participant_flow;
                            response.charts.push(c);

                            var c = {};
                            c.name = 'baseline';
                            c.data = ctc.baseline;
                            response.charts.push(c);

                            var c = {};
                            c.name = 'serious_events';
                            c.data = ctc.serious_events;
                            response.charts.push(c);

                            var c = {};
                            c.name = 'other_events';
                            c.data = ctc.other_events;
                            response.charts.push(c);


                            resp.push(response);
                        });
                    });

                    utils.writeResponse(req, res, resp);
                });
        }
    };
    var processResults = function(data, sessionToken, searchText, req, res) {

        var results = data.results;
        var search = {
            search_text: searchText,
            session_token: sessionToken,
            ctcs: []
        };

        var conditions = [];
        var outcomes = [];

        for (var i = 0; i < results.length; i++) {
            var ctc = {};
            ctc.nct_id = results[i].id;
            ctc.summary = results[i].brief_summary.textblock;
            ctc.overall_status = results[i].overall_status;
            ctc.type = results[i].study_type;
            ctc.conditions = results[i].condition;
            ctc.primary_outcomes = results[i].primary_outcome;
            ctc.secondary_outcomes = results[i].secondary_outcome;
            ctc.clinical_results = utils._.size(results[i].clinical_results) > 0 ? 'Yes' : 'No';
            ctc.results = utils._.size(results[i].clinical_results) > 0 ? results[i].clinical_results : {};
            ctc.serious_events = getEventsDataForGraphs('serious_events', ctc);
            ctc.other_events = getEventsDataForGraphs('other_events', ctc);
            ctc.baseline = getBLDataForGraphs(ctc);
            ctc.participant_flow = getPFDataForGraphs(ctc);

            search.ctcs.push(ctc);
        }

        ctcModel.Searchs(search).save(function(err, search) {
            var resp = {
                status: 200,
                message: 'Success'
            };
            utils.writeResponse(req, res, resp);
        });
    }

    function getGroup(groupList, groupId) {

        var groups = groupList.group;
        console.log(groupList);
        for (var i = 0; i < groups.length; i++) {
            console.log(groupId + ':' + groups[i].attributes.group_id);
            if (groupId === groups[i].attributes.group_id)
                return groups[i].title || groups[i].description || groupId;
        }
        return group_id;
    }

    function getBLDataForGraphs(data) {

        if (typeof data.results === 'undefined' ||
            typeof data.results.baseline === 'undefined' ||
            typeof data.results.baseline.measure_list === 'undefined')
            return [];

        var measures = data.results.baseline.measure_list.measure;

        var charts = [];

        for (var i = 0; i < measures.length; i++) {

            var chart = {};
            chart.chart_title = measures[i].title;

            if (typeof measures[i].dispersion != 'undefined' && measures[i].dispersion != null)
                chart.chart_title += ' ' + measures[i].dispersion;

            var categories = measures[i].category_list.category;

            chart.categories = [];
            chart.series = [];

            for (var j = 0; j < categories.length; j++) {

                var t = '';
                if (typeof categories[j].sub_title != 'undefined' && categories[j].sub_title != null) {
                    t = categories[j].sub_title;
                } else
                    t = measures[i].title;
                chart.categories.push(t);

                var measurements = categories[j].measurement_list.measurement;

                for (var k = 0; k < measurements.length; k++) {

                    var group_id = getGroup(data.results.baseline.group_list, measurements[k].attributes.group_id);
                    console.log('group_id : ' + group_id);
                    var exists = false;
                    for (var l = 0; l < chart.series.length; l++) {
                        if (typeof chart.series[l].name != 'undefined' && chart.series[l].name === group_id) {
                            if (chart.series[l].data === 'undefined' || chart.series[l].data === null)
                                chart.series[l].data = [];
                            chart.series[l].data.push(Number(measurements[k].attributes.value));
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        var tmp = {};
                        tmp.name = group_id;
                        tmp.type = 'column';
                        tmp.data = [];
                        tmp.data.push(Number(measurements[k].attributes.value));
                        chart.series.push(tmp);
                    }
                }
            }
            charts.push(chart);
        }
        console.log('Charts from BL ' + charts);
        return charts;
    }

    function getPFDataForGraphs(data) {

        if (typeof data.results === 'undefined' ||
            typeof data.results.participant_flow === 'undefined' ||
            typeof data.results.participant_flow.period_list === 'undefined')
            return [];

        var periods = data.results.participant_flow.period_list.period;

        var charts = [];

        for (var i = 0; i < periods.length; i++) {
            var chart = {};
            chart.chart_title = periods[i].title;

            var milestones = periods[i].milestone_list.milestone;

            chart.categories = [];
            chart.series = [];

            for (var j = 0; j < milestones.length; j++) {

                chart.categories.push(milestones[i].title);

                var participants = milestones[j].participants_list.participants;

                for (var k = 0; k < participants.length; k++) {
                    var group_id = getGroup(data.results.participant_flow.group_list, participants[k].attributes.group_id);
                    var exists = false;
                    for (var l = 0; l < chart.series.length; l++) {
                        if (typeof chart.series[l].name != 'undefined' && chart.series[l].name === group_id) {
                            if (chart.series[l].data === 'undefined' || chart.series[l].data === null)
                                chart.series[l].data = [];
                            chart.series[l].data.push(Number(participants[k].attributes.count));
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        var tmp = {};
                        tmp.name = group_id;
                        tmp.type = 'column';
                        tmp.data = [];
                        tmp.data.push(Number(participants[k].attributes.count));
                        chart.series.push(tmp);
                    }
                }
            }
            charts.push(chart);
        }
        return charts;
    }
    var getEventsDataForGraphs = function getEventsDataForGraphs(eventType, data) {

        var charts = [];

        if (typeof data.results === 'undefined' || typeof data.results === null ||
            typeof data.results.reported_events === 'undefined' ||
            typeof data.results.reported_events[eventType] === 'undefined' ||
            typeof data.results.reported_events[eventType].category_list === 'undefined')
            return charts;

        var categories = data.results.reported_events[eventType].category_list.category;


        for (var i = 0; i < categories.length; i++) {
            var chart = {};
            chart.chart_title = categories[i].title;

            var events = categories[i].event_list.event;

            chart.categories = [];
            chart.series = [];
            for (var j = 0; j < events.length; j++) {
                chart.categories.push(events[j].sub_title.value);
                var counts = events[j].counts;
                for (var k = 0; k < counts.length; k++) {
                    var group_id = getGroup(data.results.reported_events.group_list, counts[k].attributes.group_id);
                    var exists = false;
                    for (var l = 0; l < chart.series.length; l++) {
                        if (typeof chart.series[l].name != 'undefined' && chart.series[l].name === group_id) {
                            if (chart.series[l].data === 'undefined' || chart.series[l].data === null)
                                chart.series[l].data = [];
                            chart.series[l].data.push(Number(counts[k].attributes.subjects_affected));
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        var tmp = {};
                        tmp.name = group_id;
                        tmp.type = 'column';
                        tmp.data = [];
                        tmp.data.push(Number(counts[k].attributes.subjects_affected));
                        chart.series.push(tmp);
                    }
                }
            }
            charts.push(chart);
        }
        return charts;
    }
    app.post('/search', search);
    app.get('/search/*', search);
    app.get('/search', search);
}