/* eslint no-shadow: 0 */

const test = require("tap").test;
const ss = require("../index.js");

test("combinations", function (t) {
    t.test("generates 1 permutation", function (t) {
        t.same(ss.combinationsReplacement([1], 1), [[1]]);
        t.end();
    });
    t.test(
        "generates combinations of 1,2 choosing two at a time, with replacement",
        function (t) {
            t.same(ss.combinationsReplacement([1, 2], 2), [
                [1, 1],
                [1, 2],
                [2, 2]
            ]);
            t.end();
        }
    );
    t.end();
});
