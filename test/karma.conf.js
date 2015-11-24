module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/bower_components/restangular/src/restangular.js',
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/app.js',
      'app/filters/*.js',
      'app/services/*.js',
      'app/components/**/*.js',
      'app/vendor/base64.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
