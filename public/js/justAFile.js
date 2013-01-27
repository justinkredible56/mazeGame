define([], function () {

  console.log('this gets run when justafile is loaded');

  var myGlobal;

  function work() {
    alert('you set the global to ' + myGlobal);
  };

  return {
    work: work,
    prep: function () {
      myGlobal = 7;
    }
  };

});
