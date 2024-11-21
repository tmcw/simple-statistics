/* eslint no-shadow: 0 */

const test = require("tap").test;
const ss = require("../dist/simple-statistics.js");

test("quantile", function (t) {
    // Data and results from
    // [Wikipedia](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    t.test("can get proper quantiles of an even-length list", function (t) {
        const even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
        t.equal(ss.quantile(even, 0.25), 7);
        t.equal(ss.quantile(even, 0.5), 9);
        t.equal(ss.quantile(even, 0.75), 15);
        t.end();
    });

    t.test("can get proper quantiles of an odd-length list", function (t) {
        const odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
        t.equal(ss.quantile(odd, 0.25), 7);
        t.equal(ss.quantile(odd, 0.5), 9);
        t.equal(ss.quantile(odd, 0.75), 15);
        t.end();
    });

    t.test("the median quantile is equal to the median", function (t) {
        const rand = [1, 4, 5, 8];
        t.equal(ss.quantile(rand, 0.5), ss.median(rand));
        const rand2 = [10, 50, 2, 4, 4, 5, 8];
        t.equal(ss.quantile(rand2, 0.5), ss.median(rand2));
        t.end();
    });

    t.throws(function () {
        ss.quantile([], 0.5);
    }, "a zero-length list throws an error");

    t.test("test odd-value case", function (t) {
        t.equal(ss.quantile([0, 1, 2, 3, 4], 0.2), 1);
        t.end();
    });

    t.test("bad bounds throw an error", function (t) {
        t.throws(function () {
            ss.quantile([1, 2, 3], 1.1);
        });
        t.throws(function () {
            ss.quantile([1, 2, 3], -0.5);
        });
        t.end();
    });

    t.test("max quantile is equal to the max", function (t) {
        t.equal(ss.quantile([1, 2, 3], 1), ss.max([1, 2, 3]));
        t.end();
    });

    t.test("min quantile is equal to the min", function (t) {
        t.equal(ss.quantile([1, 2, 3], 0), ss.min([1, 2, 3]));
        t.end();
    });

    t.test(
        "if quantile arg is an array, response is an array of quantiles",
        function (t) {
            const odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
            t.same(
                ss.quantile(odd, [0, 0.25, 0.5, 0.75, 1]),
                [3, 7, 9, 15, 20]
            );
            t.same(ss.quantile(odd, [0.75, 0.5]), [15, 9]);
            t.end();
        }
    );

    t.test(
        "can get an array of quantiles on a small number of elements",
        function (t) {
            const input = [500, 468, 454, 469];
            t.same(ss.quantile(input, [0.25, 0.5, 0.75]), [461, 468.5, 484.5]);
            t.same(
                ss.quantile(input, [0.05, 0.25, 0.5, 0.75, 0.95]),
                [454, 461, 468.5, 484.5, 500]
            );
            t.end();
        }
    );

    t.test("array of quantiles matches single quantiles", function (t) {
        const input = [
            4534264, 0, 0, 4441655, 7982031, 11183760, 8374531, 7537166,
            6408451, 4858231, 6409803, 4296216, 5367514, 6364913, 8621150,
            9236261, 7850954, 6026897, 3569031, 5336662, 6953168, 6789669,
            6225885, 5217135, 6199349, 5858452, 7235692, 5129514, 5161771,
            6488305, 8371033, 6753743, 6595808, 8505806, 7272245, 9785009,
            8023968, 8370252, 7616759, 9758307, 9549180, 11536569, 17198302
        ];
        const [p00, p05, p95, p100] = [0, 3569031, 11183760, 17198302];
        t.same(ss.quantile(input, [0, 0.05, 0.95, 1.0]), [p00, p05, p95, p100]);
        t.same(ss.quantile(input, 0), p00);
        t.same(ss.quantile(input, 0.05), p05);
        t.same(ss.quantile(input, 0.95), p95);
        t.same(ss.quantile(input, 1.0), p100);
        t.end();
    });

    t.end();
});
