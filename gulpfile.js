const gulp = require('gulp');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

tsPipeline.registerBuildGulpTasks(
  gulp,
  {
    entryPoints: {
      'browserBundle': __dirname + '/src/browser-app.ts',
      'nodeBundle': __dirname + '/src/app.ts'
    },
    outputDir: __dirname + '/dist'
  }
);

