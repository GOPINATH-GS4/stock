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
        console.log('Rendering collection ');
        console.log(collection);
        c.render(collection);
    });

    // Drag and Drop logic for handling drop of nctIds 

    var collectionDrops = document.getElementsByName('droptocollections');

    for (var i = 0; i < collectionDrops.length; i++) {
        collectionDrops[i].setAttribute('id', collections[i].CollectionName);
    }

    var deleteCollections = document.getElementsByName('deleteCollection');

    for (var i = 0; i < deleteCollections.length; i++) {
        deleteCollections[i].setAttribute('id', collections[i].CollectionName);
        deleteCollections[i].addEventListener('click', deleteCollection);
    }

};

function deleteCollection(e) {

    var collectionId = e.target.id;
    console.log(collectionId);
    console.log('Removing collection ' + collectionId + ' for user ' + user_id);

    var c = new app.CollectionModel({
        userId: user_id,
        collectionName: collectionId
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