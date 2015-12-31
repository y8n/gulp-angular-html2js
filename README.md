# gulp-angular-html2js
Compiles AngularJS templates to JavaScript.

## Install

``` bash
npm install gulp-angular-html2js --save-dev
```

## Usage

``` javascript
var gulp = require('gulp'),
    html2js = require('gulp-angular-html2js');

gulp.task('default', function () {
    gulp.src("index.js")
        .pipe(html2js({
            moduleName:function(filename,subpath){
                return subpath.replace(/^src\//,'');
            },
            templateUrl:"templates/demo.html",
            rename:function(fileName){
                return fileName+'.js';
            }
        }))
        .pipe(gulp.dest('dest'));
});
```

## Options

- __moduleName__ : define module's name.  
	- Type:`string`|`function`  
	- default:"angular-module"

- __templateUrl__ : define template's name.  
	- Type:`string`|`function`  
	- default:same as moduleName

- __rename__ : rename output file.  
	- Type:`string`|`function`    

## License
__MIT__
