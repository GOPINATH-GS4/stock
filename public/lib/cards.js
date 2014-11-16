  var app = {};

  // Models 

  app.SearchModel = Backbone.Model.extend({
      idAttribute: "session_token",
      urlRoot: function() {
          var u = '/search/' + this.id;
          return u;
      }
  });

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
  app.pView = Backbone.View.extend({
      tagName: 'p',
      setValue: function(val) {
          this.$el.html(val);
      }
  });


  app.cardList = Backbone.View.extend({
      initialize: function(x) {
          this.setElement(x);
      }
  });

  app.cardView = Backbone.View.extend({
      tagName: 'div',
      initialize: function(cardNum) {
          var p = new app.pView();
          p.$el.html(cardNum);
          p.$el.addClass('centerText');
          p.$el.addClass('bigText');
          this.$el.html(p.el);
      },
      addView: function(tag, view) {
          this.$el.addClass(view);
          this.$el.addClass('bg_white');
          var cl = new app.cardList(tag);
          cl.$el.append(this.el);
      },
      addData: function(val) {
          var pView = new app.pView();
          pView.$el.addClass('blue');
          pView.$el.html(val);
          this.$el.append(pView.el);
      },
      render: function(val, tag, view) {
          this.addData(val);
          this.addView(tag, view);
      }
  });
  var cardView = new app.cardView();