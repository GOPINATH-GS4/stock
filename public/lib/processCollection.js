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

    // Drag and Drop logic for handling drop of nctIds 

    var collectionDrops = document.getElementsByName('droptocollections');

    for(var i = 0; i < collectionDrops.length; i++) 
      collectionDrops[i].setAttribute('id', collections[i].collectionName);

};

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var nct_id = ev.dataTransfer.getData("nct_id");
    console.log('User ' + username + ' added nct_id ' + nct_id + ' to collection ' + ev.toElement.id);
}
