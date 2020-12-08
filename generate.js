const fs = require('fs')

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            if (name.match(/script\.js$/))
                files_.push(name);
        }
    }
    return files_;
}

const file = getFiles('./example/web-components')

const fix = path => path.replace('.', '')

const formatPath = path => `import '${fix(path)}'`

const importFileArr = file.map(formatPath)

const importFileStr = importFileArr.join('\n') + '\n'

fs.writeFileSync('./example/web-components.js', importFileStr)