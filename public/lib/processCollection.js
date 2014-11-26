var collections = new app.CollectionCollection({
    userId: 1000001
});

collections.fetch({
    reset: true,
    success: function(e, response) {
        processCollectionModels(response);
    },
    error: function(e, response) {}
});

function processCollectionModels(collections) {
    var collection = new app.collectionList();
    _.each(collections, function(data, index) {
        var c = new app.collectionView(data);
        c.render(collection);
    });
};