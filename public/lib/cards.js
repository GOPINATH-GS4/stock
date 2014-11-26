  // Models 

  app.SearchModel = Backbone.Model.extend({
      idAttribute: "session_token",
      urlRoot: function() {
          var u = '/search/' + this.id;
          return u;
      }
  });

  // Collections 
  app.SearchCollection = Backbone.Collection.extend({
      model: app.SearchModel,
      url: function() {
          if (typeof this.id === 'undefined')
              return '/search';
          else
              return '/search/' + this.id;
      },
      initialize: function(options) {
          if (typeof options != 'undefined')
              this.id = options.session_token;
      }
  });

  // Views 

  app.cardList = Backbone.View.extend({
      el: '#cardList'
  });


  app.cardView = Backbone.View.extend({
      tagName: 'div',
      initialize: function(card) {
          this.card = card;
      },
      template: _.template($("#card-template").html()),
      render: function(cardList) {
          this.$el.html(this.template({
              card: this.card
          }));
          this.$el.addClass('card');
          cardList.$el.append(this.el);
          return this;
      }
  });