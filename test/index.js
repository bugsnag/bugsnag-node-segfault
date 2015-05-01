var expect = require('chai').expect;
var fs = require('fs');
var stacktrace = require('stack-trace');

var segfaultHandler = require('../');

describe('parseReport', function () {
    it("should parse reports from linux", function () {

        var report = fs.readFileSync("test/fixtures/linux.txt").toString("utf-8");

        var e = segfaultHandler.parseReport(report);

        expect(e.message).to.equal("PID 9662 received SIGSEGV for address: 0x0");
        expect(e.constructor.name).to.equal('SEGFAULT');

        var stack = stacktrace.parse(e);

        expect(stack[3].fileName).to.equal('node');
        expect(stack[3].functionName).to.equal('_ZN2v88internal25MarkCompactMarkingVisitor20VisitUnmarkedObjectsEPNS0_4HeapEPPNS0_6ObjectES6_+0x129');
    });

    it("should parse reports from darwin", function () {

        var report = fs.readFileSync("test/fixtures/darwin.txt").toString("utf-8");

        var e = segfaultHandler.parseReport(report);

        expect(e.message).to.equal("PID 52268 received SIGSEGV for address: 0x1");
        expect(e.constructor.name).to.equal('SEGFAULT');

        var stack = stacktrace.parse(e);

        expect(stack[3].functionName).to.equal('0x00000001008f9ac6._Z22segfault_stack_frame_2v.+.22');
        expect(stack[3].fileName).to.equal('segfault-handler.node');
    });
});
