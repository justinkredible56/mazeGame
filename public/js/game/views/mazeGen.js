define([], function () {
function maze(size) {
  var x = size || 5;
  var y = size || 5;

  var cells = setupCells(x, y);
  var walls = setupWalls(x, y);

  var finishedWalls = removeWalls(cells, walls);
  return {walls: finishedWalls,
            size: size};
};

function removeWalls(cells, walls) 
{
    var mazeWalls = [];
    while(walls.length) 
    {
        var id = Math.floor(Math.random() * (walls.length - 1));
        var thisWall = walls[id];
        var cell1 = cells[Math.floor(thisWall.x)][Math.floor(thisWall.y)];
        var cell2 = cells[Math.ceil(thisWall.x)][Math.ceil(thisWall.y)];
    
        if (cell1 === cell2)
            mazeWalls.push(thisWall);
        else 
        {
            for (var n = 0; n < cells.length; ++n) 
                for (var m = 0; m < cells[n].length; ++m)   
                    if (cells[n][m] === cell2) 
                        cells[n][m] = cell1;
        }

        walls.splice(id, 1); // delete that wall from the list
    }

    return mazeWalls
};

function setupCells(x, y) {
    var cells = [];

    // generate cells
    var groupIDCount = 0;
    for (var n = 0; n < x; ++n)
        cells[n] = [];

    for(var n = 0; n < x; ++n)
        for (var m = 0; m < y; ++m)
        { 
            cells[n][m] = groupIDCount;
            ++groupIDCount;
        }


  return cells;
};


function setupWalls(x, y) {
    var walls = [];

  // generate and add walls
    for (var n = 0; n < y; ++n)
        for (var m = 0; m < x; ++m) 
    {
      // add a right wall
      if (m < (x - 1)) 
            walls.push({
              x: m + .5,
              y: n
            });
      

      // add a bottom wall
      if (n < (y - 1)) 
            walls.push({
              x: m,
              y: n + .5
            });
      
    }

  return walls;
};

function makeEmptyMaze(size)
{
    var emptyMaze = [];

    for (var n = 0; n < size; ++n) {
        var temp = [];
        for (var m = 0; m < size; ++m) {
            temp.push({
                rightWall: false,
                bottomWall: false,
                x: m,
                y: n,
                beginning: (m == 0 && n == 0 || m == size-1 && n == size-1)
            });
        }
        emptyMaze.push(temp);
    }

    return emptyMaze;

};

function addWall(thisWall, maze)
{
    var thisX = thisWall.x;
    var thisY = thisWall.y;

    if(thisX % 1 != 0)
    {
        //vertical wall
        //so n will be odd and m will be even
        thisX = Math.floor(thisX);
        maze[thisX][thisY].bottomWall = true;
    }

    else if(thisY % 1 != 0)
    {
        //horizontal wall
        //so n will be even and m will be odd
        thisY = Math.floor(thisY);
        maze[thisX][thisY].rightWall = true;
    }




    return maze;
};


function display(mazeObj)
{
    var maze = makeEmptyMaze(mazeObj.size);

    for(var n = 0; n < mazeObj.walls.length; ++n)
        maze = addWall(mazeObj.walls[n], maze);




    //console.log(maze);

    return maze;
};

      return { maze: maze,
                display: display};
});