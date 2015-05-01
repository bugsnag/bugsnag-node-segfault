var segfault = require('segfault');
var fs = require('fs');

function SEGFAULT(message, stack) {
    this.message = message;
    this.stack = stack;
}

module.exports = function (bugsnag, options) {
    if (!options) {
        options = {};
    }

    if (!options.dir) {
        options.dir = "/tmp/bugsnag-segfault";
    }

    segfault.registerHandler(options.dir);

    fs.readdir(options.dir, function (err,files) {

        if (err) {
            console.error(err && err.stack || err);
            bugsnag.notify(err);
            return;
        }

        files.forEach(function (file) {
            fs.readFile(options.dir + "/" + file, 'utf-8', function (err, report) {
                if (err) {
                    console.error(err && err.stack || err);
                    bugsnag.notify(err);
                    return;
                }
                fs.unlink(options.dir + "/" + file, function (err) {
                    if (err) {
                        console.error(err && err.stack || err);
                        bugsnag.notify(err);
                        return;
                    }
                });

                bugsnag.notify(module.exports.parseReport(report), {groupingHash: 'SIGSEGV'});
            });
        });
    });
};

module.exports.parseReport = function (report) {
    var lines = report.split("\n");

    var stack = lines[0];

    for (var i = 1; i < lines.length; i++) {
        var match = lines[i].match(/([0-9]+)\s+([^\s]+)\s+(.+)/);
        if (match) {
            stack += "\n    at " + match[3].replace(/\s/g, ".") + " (" + match[2].replace(/\s/g, ".") + ":1:1)";
            continue;
        }

        match = lines[i].match(/([^(]+)\(([^\)]+)\)\[([^\]]+)\]$/);
        if (match) {
            stack += "\n    at " + match[2].replace(/\s/g, ".") + " (" + match[1].replace(/\s/g, ".") + ":1:1)";
            continue;
        }


        if (lines[i]) {
            console.log("FAILED: " + lines[i]);
        }
    }

    return new SEGFAULT(lines[0], stack);
};

module.exports.test = function () {
    segfault.causeSegfault();
};
