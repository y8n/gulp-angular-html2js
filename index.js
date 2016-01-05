var through = require('through2'),
    path = require('path');
module.exports = function (options) {
    options = options || {};
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }
        var sep = path.sep,
            cwd = file.cwd,
            filepath = file.path,
            fileName = filepath.match(new RegExp("[^\\" + sep + "]+$", 'g'))[0],
            subpath = filepath.slice(cwd.length + 1).replace(new RegExp("\\" + sep, 'g'), '/');
        /**
         * 定义模块名称
         */
        var moduleName = (function () {
            var name = options.moduleName;
            if (!name) {
                return 'angular-module';
            }
            if (typeof name === 'string') {
                return name;
            }
            if (typeof name === 'function') {
                return name(fileName, subpath).toString();
            }
            return name.toString();
        })();
        /**
         * 定义模板URL
         */
        var templateUrl = (function () {
            var url = options.templateUrl;
            if (!url) {
                return moduleName;
            }
            if (typeof url === 'string') {
                return url;
            }
            if (typeof url === 'function') {
                return url(fileName, subpath).toString();
            }
            return url.toString();
        })();
        // 重命名
        renameFile();
        //拼装文件
        var template = file.contents.toString(),
            html = [];
        html.push('angular.module("' + moduleName + '",[]).run(["$templateCache",function($templateCache){');
        html.push('    $templateCache.put("' + templateUrl + '",');
        html.push('    "' + formateTemplate(template) + '");');
        html.push('}]);');

        file.contents = new Buffer(html.join('\n'));
        this.push(file);
        cb();

        // 格式化文件内容，将回车，"，末尾的空格和换行去掉，拼接字符串
        function formateTemplate(template) {
            var reg = /(")|(\n)|([\n\s]+$)/g;
            return template.replace(reg, function (m, $1, $2, $3) {
                return $1 ? '\\"' : $2 ? '"+\n    "' : $3 ? '' : m;
            });
        }

        //重命名文件
        function renameFile() {
            var rename = options.rename, newName;
            if (!rename) {
                newName = fileName;
            } else if (typeof rename === 'string') {
                newName = rename;
            } else if (typeof rename === 'function') {
                newName = rename(fileName, subpath).toString();
            } else {
                newName = rename.toString();
            }
            file.path = file.path.replace(new RegExp("[^\\" + sep + "]+$", 'g'), newName);
        }
    });
};