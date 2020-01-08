var path = require('path');
var fs = require('fs');
/**
 * List file list
 *
 * @author fenqiang.chen
 * @param {string} curPath
 */
function listFiles() {
    var files = [];

    return function loadFiles (curPath, clear) {
        if (clear) {
            files = [];
        }

        curPath = curPath.replace(/\\/g, '/');
        fs.readdirSync(curPath).forEach(function (item) {
            var curFile = path.join(curPath, item);
            var stat = fs.lstatSync(curFile);
            if (stat.isDirectory()) {
                loadFiles(curFile);
            }
            else {
                curFile = curFile.replace(/\\/g, '/');
                files.push(curFile);
            }
        });

        return files;
    };
}

/**
 * List dir list
 */
function listDir() {
    var dirs = [];

    return function loadFiles(curPath, clear) {
        if (clear) {
            dirs = [];
        }

        curPath = curPath.replace(/\\/g, '/');
        fs.readdirSync(curPath).forEach(function (item) {
            var curFile = path.join(curPath, item);
            var stat = fs.lstatSync(curFile);
            if (stat.isDirectory()) {
                dirs.push(curFile);
            }
        });

        return dirs;
    }
}

var ls = listFiles();
var ls_dir = listDir();

var dirs = ls_dir(path.resolve(__dirname));

var commonStyles = [];

dirs.forEach(function (dir) {
    var files = ls(dir, true);
    if (/\/assets|\/components/.test(dir)) {
        var dirname = path.dirname(dir);
        commonStyles = commonStyles.concat(
            files
                .filter(item => /\.(css|scss)$/.test(item) && !/reset\.scss/.test(item))
                .map(item => {
                    var reg = new RegExp(`${dirname}`, 'g');
                    var file = item.replace(reg, '');
                    return file;
                })
            );
    } else {
        fs.writeFileSync(`${dir}/styles.js`, '');

        files.forEach(function (item) {
            if (/reset\.css/.test(item)) {
                return;
            }

            if (/\.(css|scss)$/.test(item)) {
                var reg = new RegExp(`${dir}`, 'g');
                var file = item.replace(reg, '.');

                fs.writeFileSync(`${dir}/styles.js`, `import '${file}';\n`, { flag: 'a' });
            }
        });
    }
});

commonStyles = commonStyles.map(item => `import '..${item}';`);
dirs.forEach(function (dir) {
    if (!/assets|components/.test(dir)) {
        fs.writeFileSync(`${dir}/styles.js`, commonStyles.join('\n'), { flag: 'a' });
    }
});
