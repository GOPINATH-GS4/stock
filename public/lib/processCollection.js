var collections = new app.CollectionCollection({
    userId: 1000001
});

collections.fetch({
    reset: true,
    success: function(e, response) {
        console.log(response);
        processModels(response);
    },
    error: function(e, response) {}
});

function processModels(collections) {
    var collection = new app.collectionList();
    _.each(collections, function(data, index) {
        console.log('data = ' + JSON.stringify(data));
        var c = new app.collectionView(data);
        c.render(collection);
    });
};