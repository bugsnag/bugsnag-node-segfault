A handler for sending segfaults in native node extensions to Bugsnag.

# Usage

First install both the normal [bugsnag-node](https://github.com/bugsnag/bugsnag-node) module,
and also the `bugsnag-segfault-handler`.

```
npm install --save bugsnag bugsnag-segfault-handler
```

Then initialize Bugsnag as normal, and also pass it into the Segfault handler:

```
var bugsnag = require('bugsnag');
bugsnag.register('YOUR_API_KEY_HERE');

var segfaultHandler = require('bugsnag-segfault-handler');
segfaultHandler(bugsnag, {dir: "/tmp/bugsnag-segfaults"});
```

To test the integration run:

```
segfaultHandler.test()
```

Then run your app *twice*. The first time it will segfault, the second time it
will send the report to Bugsnag.

# How it works

When your program receives a Segfault, the
[segfault](https://github.com/ConradIrwin/node-segfault-handler) module logs
the segfault to the directory you specify.

The next time your app starts, we read the segfault report out of that directory and send it to Bugsnag.
