define([
    'backbone',
    'tmpl!game/templates/gameStart',
    'tmpl!game/templates/highScores',
    'tmpl!game/templates/credits',
    'tmpl!game/templates/gameSize',
    'tmpl!game/templates/mazeStart'
], function (
    Backbone,
    gameStartTmpl,
    highScoreTmpl,
    creditsTmpl,
    gameSizeTmpl,
    mazeStartTmpl
) {
    return Backbone.View.extend({
        highScores: undefined,
        

        initialize: function () {
        },

        events: {
            'click .gamebtn': 'optionEvent',
            'click .gameSize': 'gameSize',
            
        },

        optionEvent: function(e){
            var pickedOption = $(e.target).closest('.gamebtn').html();
            console.log(pickedOption);
            if(pickedOption === "New Game")
                this.startGame();
            if(pickedOption === "High Scores")
                this.showHighScores();
            if(pickedOption === "Credits")
                this.showCredits();
            if(pickedOption === "Exit")
                {
                    $('.test').html("<script type = 'text/javascript'>self.close();</script>");

                    // var script=document.createElement('script');
                    // script.type='text/javascript';
                    // script.src=url;

                    // $("body").append(script);
                }
        },

        gameSize: function(e){
            var pickedOption = $(e.target).closest('.gameSize').html();
            var size = 0;
            if(pickedOption === "20 X 20")
                size = 20;
            if(pickedOption === "15 X 15")
                size = 15;
            if(pickedOption === "10 X 10")
                size = 10;
            if(pickedOption === "5 X 5")
                size = 5;
            console.log(size);
            this.$el.html(mazeStartTmpl(size));

        },

        startGame: function(){
            this.$el.html(gameSizeTmpl());
        },

        showHighScores: function(){
            this.$el.html(highScoreTmpl(this.highScores));
        },

        showCredits: function(){
            this.$el.html(creditsTmpl());
        },
        render: function () {
            var that = this;
            $.get('/highScores', function (data) {
            that.highScores = data;
            console.log(data);
            });

            this.$el.html(gameStartTmpl());
            return this;
        }
    });
});