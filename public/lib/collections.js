// Models 

app.CollectionModel = Backbone.Model.extend({
    idAttribute: "userId",
    urlRoot: function() {
        var u = '/collection';
        if (typeof this.id === 'undefined')
            var u = '/collection';
        return u;
    }
});

// Collections 
app.CollectionCollection = Backbone.Collection.extend({
    model: app.CollectionModel,
    url: function() {
        if (typeof this.id === 'undefined')
            return '/collection';
        else
            return '/collection/' + this.id;
    },
    initialize: function(options) {
        if (typeof options != 'undefined')
            this.id = options.userId;
    }
});

// Views 

app.collectionList = Backbone.View.extend({
    el: '#collection'
});


app.collectionView = Backbone.View.extend({
    tagName: 'li',
    initialize: function(collection) {
        this.collection = collection;
    },
    template: _.template($("#collection-template").html()),
    render: function(c) {
        this.$el.html(this.template({
            collection: this.collection
        }));
        c.$el.append(this.el);
        return this;
    }
});