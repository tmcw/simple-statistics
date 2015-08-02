'use strict';

var sortedUniqueCount = require('./sorted_unique_count');

/**
 * The **[jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)**
 * is an algorithm commonly used in cartography and visualization to decide
 * upon groupings of data values that minimize variance within themselves
 * and maximize variation between themselves.
 *
 * For instance, cartographers often use jenks in order to choose which
 * values are assigned to which colors in
 * a [choropleth](https://en.wikipedia.org/wiki/Choropleth_map)
 * map.
 *
 * @param {Array<number>} data input data, as an array of number values
 * @param {number} nClasses number of desired classes
 * @returns {Array<number>} array of class break positions
 * @examples
 * // split data into 3 break points
 * jenks([1, 2, 4, 5, 7, 9, 10, 20], 3) // = [1, 7, 20, 20]
 */
function cKmeans(data, nClasses) {

    if (nClasses > data.length) { return null; }

    // .slice() to avoid changing the input data in-place
    var sorted = data.slice().sort(function(a, b) {
        return a - b;
    });

    // we'll use this as the maximum number of clusters
    var uniqueCount = sortedUniqueCount(sorted);

    if (uniqueCount === 1) {
        var clusters = [];
        for (var j = 0; j < data.length; j++) {
            clusters.push(j);
        }
        // all of the input values are identical, so there's one cluster
        // with all of the input in it.
        return {
            clusters: clusters,
            centers: [data[0]],
            withinss: [0],
            size: [data.length]
        };
    }

    // named 'D' originally
    var matrix = [];

    // named 'B' originally
    var backtrackMatrix = [];

    var meanX1 = 0,
        meanXJ = 0,
        d = 0;

    // Initialize dynamic programming matrices
    for (var n = 0; n < sorted.length; n++) {
        matrix[n] = [];
        backtrackMatrix[n] = [];
        for (var k = 0; k < uniqueCount; k++) {
            // in the original implementation, this initialization to
            // 1 is deferred
            // to `fill_dp_matrix`, but JavaScript arrays don't have the
            // same initialization style: `(new Array(2))[0] == undefined`,
            // not 0. so we do it in one step.
            if (k === 0) {
                matrix[n][k] = 1;
                backtrackMatrix[n][k] = 1;
            } else {
                matrix[n][k] = 0;
                backtrackMatrix[n][k] = 0;
            }
        }
    }

    for (var k = 1; k <= nClasses; ++k) {
        meanX1 = data[0];

        for (var i = Math.max(2, k); i <= data.length; ++i) {
            if (k === 1) {
                matrix[0][i] = matrix[0][i - 1] + (i - 1) / i *
                    (data[i] - meanX1) * (data[i] - meanX1);
                meanX1 = ((i - 1) * meanX1 + data[i]) / i;
                backtrackMatrix[0][i] = 1;
            } else {
                matrix[k][i] = -1;
                d = 0;
                meanXJ = 0;

                for (var j = i; j >= k; --j) {
                    d = d + (i - j) / (i - j + 1) *
                        (data[j] - meanXJ) * (data[j] - meanXJ);
                    meanXJ = (data[j] + (i - j) * meanXJ) / (i - j + 1);

                    if (matrix[k][i] === -1) {
                        if (j === 1) {
                            matrix[k][i] = d;
                            backtrackMatrix[k][i] = j;
                        } else {
                            matrix[k][i] = d + matrix[k - 1][j - 1];
                            backtrackMatrix[k][i] = j;
                        }
                    } else {
                        if (j === 1) {
                            if (d <= matrix[k][i]) {
                                matrix[k][i] = d;
                                backtrackMatrix[k][i] = j;
                            }
                        } else if (d + matrix[k - 1][j - 1] < matrix[k][i]) {
                            matrix[k][i] = d + matrix[k - 1][j - 1];
                            backtrackMatrix[k][i] = j;
                        }
                    }
                }
            }
        }
    }

    return matrix;
}

module.exports = cKmeans;