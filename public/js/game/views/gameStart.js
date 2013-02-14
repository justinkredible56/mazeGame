define([
    'backbone',
    'tmpl!game/templates/gameStart',
    'tmpl!game/templates/highScores',
    'tmpl!game/templates/credits',
    'tmpl!game/templates/gameSize',
    'tmpl!game/templates/mazeStart',
    'tmpl!game/templates/finish',
    'game/views/mazeGen'
], function (
    Backbone,
    gameStartTmpl,
    highScoreTmpl,
    creditsTmpl,
    gameSizeTmpl,
    mazeStartTmpl,
    finishTmpl,
    makeMaze
) {
    return Backbone.View.extend({
        highScores: undefined,
        score: undefined,
        size: undefined,
        moves: 0,
        finished: false,
        curX: 0,
        curY: 0,
        Xend: undefined,
        Yend: undefined,
        startTime: undefined,
        endTime: undefined,
        elapsedTime: undefined,
        BC:false,
        

        initialize: function () {
            _.bindAll(this, 'keyInput');
            $(document).bind('keydown', this.keyInput);
        },

        events: {
            'click .gamebtn': 'optionEvent',
            'click .gameSize': 'gameSize',
            'click .hs-btn': 'savehs',
            'click .toggleBC': 'showBC',
            'click .back': 'showMain',
            'keydown': 'keyInput',
            
        },

        optionEvent: function(e){
            var pickedOption = $(e.target).closest('.gamebtn').html();
            if(pickedOption === "New Game")
                this.startGame();
            if(pickedOption === "High Scores")
                this.showHighScores();
            if(pickedOption === "Credits")
                this.showCredits();
            if(pickedOption === "Exit")
                {
                    window.open('', '_self', '');
                    window.close();
                }
        },

        gameSize: function(e){
            var pickedOption = $(e.target).closest('.gameSize').html();
            var left = '';
            var cirLeft = '';

            if(pickedOption === "20 X 20")
                {
                    this.size = 20;
                    left = '16%';
                    this.Xend = 360;
                    this.Yend = 380;
                }
            if(pickedOption === "15 X 15")
                {
                    this.size = 15;
                    left = '25%';
                    this.Xend = 260;
                    this.Yend = 280;
                }
            if(pickedOption === "10 X 10")
                {
                    this.size = 10;
                    left = '33%';
                    this.Xend = 160;
                    this.Yend = 180;
                }
            if(pickedOption === "5 X 5")
                {
                    this.size = 5;
                    left = '42%';
                    this.Xend = 60;
                    this.Yend = 80;
                } 

            var maze = makeMaze.maze(this.size);
            //console.log(maze.walls);
            divMaze = makeMaze.display(maze);
            //console.log(divMaze);

            $('.wrapper').css('opacity', '1.0');

            this.$el.html(mazeStartTmpl(divMaze));
            $('.maze-wrapper').append("<img class = 'circle' src='img/circle.png'>")
            $('html').css('overflow','hidden');
            this.startTime = new Date();


        },
        showMain: function(){
            this.$el.html(gameStartTmpl());
        },

        startGame: function(){
            this.curX = 0;
            this.curY = 0;
            this.$el.html(gameSizeTmpl());
        },

        showHighScores: function(){
            $.get('/highScores', function (data) {
            that.highScores = data;
            });
            this.$el.html(highScoreTmpl(this.highScores));
        },

        showCredits: function(){
            this.$el.html(creditsTmpl());
        },

        keyInput: function(e){
            if(this.finished == false)
            { 
                var key = e.keyCode;
                ++this.moves;
                var Y = parseFloat($('.circle').css('top'));
                var X = parseFloat($('.circle').css('left'));

                switch(key)
                {
                    case 37:
                        //left
                        this.curX--;
                        if(this.collision('left'))
                            this.curX++;
                        var temp = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        temp.addClass('crumbs');
                        if(this.BC == true)
                            $('.crumbs').css('background-color', 'red');
                        this.isEnd();
                        break;
                    case 38:
                        //up
                        this.curY--;
                        if(this.collision('up'))
                            this.curY++;
                        var temp = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        temp.addClass('crumbs');
                        if(this.BC == true)
                            $('.crumbs').css('background-color', 'red');
                        this.isEnd();
                        break;
                    case 39:
                        //right
                        this.curX++;
                        if(this.collision('right'))
                            this.curX--;
                        var temp = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        temp.addClass('crumbs');
                        if(this.BC == true)
                            $('.crumbs').css('background-color', 'red');
                        this.isEnd();
                        break;
                    case 40:
                        //down
                        this.curY++;
                        if(this.collision('down'))
                            this.curY--;
                        var temp = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        temp.addClass('crumbs');
                        if(this.BC == true)
                            $('.crumbs').css('background-color', 'red');
                        this.isEnd();
                        break;
                    default:
                        //do nothing
                        break;
                }

                var style = {
                    left: this.curX * 20 + 'px',
                    top: this.curY * 20 + 'px'
                }
                $('.circle').css(style);
            }
        },

        isEnd: function(){
            var curX = parseFloat($('.circle').css('left'));
            var curY = parseFloat($('.circle').css('top'));

            if(curX === this.Xend)
                if(curY === this.Yend)
                    {
                        this.endTime = new Date();
                        this.finished == true;
                        this.showEndScreen();
                        $('html').css('overflow', 'auto');
                    }
        },

        collision: function(direction){
            if(this.curX < 0 || this.curY < 0)
                return true;
            if(this.curX > this.size-1 || this.curY > this.size-1)
                return true;

            switch(direction)
            {
                case "left":
                        var test = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        if(test.hasClass('hasRight'))
                            return true;
                        break;
                case "up":
                        var test = $(".path[data-x = '" + this.curX + "'][data-y = '" + this.curY + "']");
                        if(test.hasClass('hasBottom'))
                            return true;
                        break;
                case "right":
                        var test = $(".path[data-x = '" + (this.curX - 1) + "'][data-y = '" + this.curY + "']");
                        if(test.hasClass('hasRight'))
                            return true;
                        break;
                case "down":
                        var test = $(".path[data-x = '" + this.curX + "'][data-y = '" + (this.curY -1) + "']");
                        if(test.hasClass('hasBottom'))
                            return true;
                        break;
                default:
                        break;



            }
            return false;
        },

        showBC: function(){
            if(this.BC == false)
            {
                $('.crumbs').css('background-color', 'red');
                this.BC = true;
            }
            else
            {
                $('.crumbs').css('background-color', '');
                this.BC = false;
            }
        },

        showEndScreen: function(){
            $('.wrapper').css('opacity', '.85');
            this.elapsedTime = (this.endTime - this.startTime)/1000;
            this.score = this.getScore();
            var isHighScore = this.checkHighScore();

            var myObj = {
                time: this.elapsedTime,
                score: this.score
            };

            if(isHighScore)
            {
                myObj.newHigh = 'test';
                this.$el.html(finishTmpl(myObj));
            }
            if(!isHighScore)
            {
                this.$el.html(finishTmpl(myObj));
            }


        },

        getScore: function(){
            var score = this.moves - this.size;
            score *= 100;
            return score;
        },

        savehs: function(){
            var newEntry = {
                name: $('.name-box').val(),
                time: this.elapsedTime,
                score: this.score
            };
            var newScores = [];
            var flag = false;
            for(var n = 0; n < 10; ++n)
            {
                if(this.score > this.highScores[n].score && flag == false)
                    {
                        newScores.push(newEntry);
                        flag = true;
                    }
                else
                    newScores.push(this.highScores[n]);
            }

            $.post('/saveScores', {
                scores: newScores
            })
            this.highScores = newScores;
            this.$el.html(gameStartTmpl());
        },

        checkHighScore: function(){
            for(var n = 0; n < this.highScores.length; ++n)
                if(this.score > this.highScores[n].score)
                        return true;
                    
                return false;
        },

        render: function () {
            var that = this;
            $.get('/highScores', function (data) {
            that.highScores = data;
            });

            this.$el.html(gameStartTmpl());
            return this;
        }
    });
});