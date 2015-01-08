var collections = new app.CollectionCollection({
    userId: user_id
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

    // Drag and Drop logic for handling drop of nctIds 

    var collectionDrops = document.getElementsByName('droptocollections');

    for (var i = 0; i < collectionDrops.length; i++)
        collectionDrops[i].setAttribute('id', collections[i].collectionName);

};

