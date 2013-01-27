/*global console, require */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl'
        // 'game/views/gameStart'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
   'jquery',
   //'tmpl!game/templates/gameSize', // changed this (HOW TO LOAD JUST A TEMPLATE)
   'game/views/gameStart',                                      // added this (HOW TO LOAD A BACKBONE VIEW)
   'justAFile'          // added this (HOW TO LOAD A RANDOM FILE)
], function(
    $,
    //justTemplate,                       // and this
    GameStartView,                                              // and this
    justFile            // and this
) {

  //$('.test').html(justTemplate())    // and this
  var gameStartView = new GameStartView();                      // and this
  $('.gameBox').html(gameStartView.render().el);                   // and this

  // note: whatever I return in the define is sent back to justFile; it doesn't have to be backbone.
  //       it could be an object, function, array, just a number, nothing. whatever
  justFile.prep();      // added this
  //justFile.work();      // added this
});


