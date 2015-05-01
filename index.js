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
                console.log("Read report: ");

                var lines = report.split("\n");

                var stack = lines[0];

                for (var i = 1; i < lines.length; i++) {
                    var match = lines[i].match(/([0-9]+)\s+([^\s]+)\s+(.+)/);
                    if (match) {

                        stack += "\n    at " + match[2] + " (" + match[3].replace(/\s/g, ".") + ":1:1)";
                    } else if (lines[i]) {
                        console.log("FAILED: " + lines[i]);
                    }
                }

                bugsnag.notify(new SEGFAULT(lines[0], stack), {groupingHash: 'SIGSEGV'});
            });
        });
    });
};

module.exports.test = function () {
    segfault.causeSegfault();
};
