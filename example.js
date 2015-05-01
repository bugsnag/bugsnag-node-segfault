
var bugsnag = require('bugsnag');

bugsnag.register("066f5ad3590596f9aa8d601ea89af845");

var bugsnagSegfault = require('./index.js');
bugsnagSegfault(bugsnag);

setTimeout(function () {
    bugsnagSegfault.test();
}, 1000);
