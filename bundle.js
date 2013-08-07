var fs = require("fs")
  , path = require("path")
  , readInstalled = require("read-installed")
  , rimraf = require('rimraf')

fs.readdir(path.resolve('lib'), function (err, libs) {
  if (err) {
    throw err
  }
  
  var modules = libs.map(function (l) { return 'lib/' + l})
  modules.push('./') // Add the root

  var total = modules.length
    , deps = {}

  modules.forEach(function (m) {
    readInstalled(path.resolve('./', m), function (err, pkg) {
      Object.keys(pkg.dependencies).forEach(function (dep) {
        var d = pkg.dependencies[dep]
        if (!(pkg.devDependencies && pkg.devDependencies.hasOwnProperty(dep))) {
          deps[dep] = pkg.dependencies[dep].version          
        }
      })
      next()
    })
  })

  var calls = 0
  function next() {
    if (++calls !== total) { return }


    // Deps contains all of our external dependencies, we need to install them.

    // Clear out all the node_modules
    console.log('external', deps)
  }

})
