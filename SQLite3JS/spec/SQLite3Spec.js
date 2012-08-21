describe('SQLite3JS', function () {
  function notNull(object) {
    return object !== null;
  }

  function errorMessage(error) {
    return error.message;
  }

  function waitsForPromise(promise) {
    var done = false;

    promise.then(function () {
      done = true;
    }, function (error) {
      var message;

      if (error.constructor === Array) {
        message = error.filter(notNull).map(errorMessage).join(', ');
      } else {
        message = errorMessage(error);
      }

      jasmine.getEnv().currentSpec.fail(message);
      done = true;
    });

    waitsFor(function () { return done; });
  }

  var db = null;
  
  
  /* this spec will run in a loop which soon crashes with an AccessDeniedException */
  it('should survive navigation without crashing', function () {
    var runnerFunc = function (i) {
      var db;
      return SQLite3JS.openAsync(':memory:').then(function (memDb) {
        db = memDb;
        return db.allAsync("SELECT 'foo', " + i, []);
      }).then(function (result) {
        return db.allAsync("SELECT 'bar', " + i, []);
      });
    }
    for (var i = 0; i < 5000; i++) {
      setImmediate(runnerFunc, i);
    }
    window.location = '/default.html?programmaticNavigation=true'
    waitsForPromise(runnerFunc(10000));
  });
});
