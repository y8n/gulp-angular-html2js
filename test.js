var assert = require('assert');
var gutil = require('gulp-util');
var path = require('path');
var html2js = require('./');
var eol = require('os').EOL;
var sep = path.sep;
require('mocha');

describe('gulp-angular-html2js test', function () {
    var file,filename='test.html',stream,html = '<div class="foo">' +eol+
        '    <span id="test">test HTML</span>' +eol+
        '</div>';
    beforeEach(function () {
        file = new gutil.File({
            contents: new Buffer(html),
            base: path.join(__dirname, './fixtures/'),
            cwd: __dirname,
            path: path.join(__dirname, './fixtures/'+filename)
        });
    });
    function getModuleName(file){
        var contents = file.contents.toString();
        return contents.match(/angular\.module\("([^"]+)",\[\]\)/)[1];
    }
    function getTemplateUrl(file){
        var contents = file.contents.toString();
        return contents.match(/\$templateCache\.put\("([^"]+)",/)[1];
    }
    function getFileName(file){
        return file.path.match(new RegExp("[^\\" + sep + "]+$", 'g'))[0];
    }
    describe('moduleName option', function () {
        it('should has a default value', function (done) {
            stream = html2js();
            stream.write(file);
            stream.on('data', function(file) {
                assert(file.isBuffer());
                assert(getModuleName(file) === 'angular-module');
                done();
            });
        });

        it('use string', function (done) {
            var moduleName = 'ui.bootstrap.button';
            stream = html2js({
                moduleName:moduleName
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getModuleName(file) === moduleName);
                done();
            });
        });

        it('use function\'s return value', function (done) {
            stream = html2js({
                moduleName:function(fileName){
                    return fileName.toUpperCase();
                }
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getModuleName(file) === filename.toUpperCase());
                done();
            });
        });

    });
    describe('templateUrl option', function () {
        it('should use moduleName as a default value', function (done) {
            var moduleName = 'angular.ui.bootstrap';
            stream = html2js({
                moduleName:moduleName
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getTemplateUrl(file) === getModuleName(file));
                done();
            });
        });

        it('use string', function (done) {
            var templateUrl = 'templates/button.html';
            stream = html2js({
                templateUrl:templateUrl
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getTemplateUrl(file) !== getModuleName(file));
                assert(getTemplateUrl(file) === templateUrl);
                done();
            });
        });

        it('use function\'s return value', function (done) {
            stream = html2js({
                moduleName:function (fileName) {
                    return 'templates/'+fileName;
                }
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getTemplateUrl(file) === 'templates/'+filename);
                done();
            });
        });
    });
    describe('renameFile option', function () {
        it('should not have a default value', function (done) {
            stream = html2js();
            stream.write(file);
            stream.on('data', function(file) {
                assert(getFileName(file) === filename);
                done();
            });
        });

        it('use string', function (done) {
            var rename = 'rename.html.tpl';
            stream = html2js({
                rename:rename
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getFileName(file) === rename);
                done();
            });
        });

        it('use function\'s return value', function (done) {
            stream = html2js({
                rename:function (fileName) {
                    return fileName+'.js';
                }
            });
            stream.write(file);
            stream.on('data', function(file) {
                assert(getFileName(file) === filename+'.js');
                done();
            });
        });
    });
});
