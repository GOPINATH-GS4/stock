  var app = {};

  app.pView = Backbone.View.extend({
    tagName: 'p',
    setValue: function(val) {
      this.$el.html(val);
    }
  });  
  

  app.cardList  = Backbone.View.extend({
    el: '#cardList'
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
    addView: function(cardNum) {
      this.$el.addClass('card');
      this.$el.addClass('bg_white');
      var cl = new app.cardList();
      cl.$el.append(this.el);
    },
    addData: function(val) {
      var pView = new app.pView();
      pView.$el.addClass('blue');
      pView.$el.html(val);
      this.$el.append(pView.el);
    },
    render: function(val) {
      this.addData(val);
      this.addView();
    }
  });


  var cardView = new app.cardView();
 
  setTimeout(function() {
      for (var card = 0; card < 20; card++) {
        var v = new app.cardView('Card num ' + card);
        for (var i = 0; i < 10; i++)
          v.render('Random value : ' + Math.floor(Math.random()* 100) + 1);
      }
  }, 3000);
