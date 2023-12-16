import {columns, fetchInputData} from "./libraries.js";

const year = 2023
const day = 13;

let file = "";

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day);
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

function findMirror(mirror, smearTarget) {
    let rows = mirror.map(v => v.join(""))
    for (let row = 0; row < rows.length - 1; row++) {
        let smears = 0
        let rowsToCheck = row + 1
        if (rowsToCheck > 0) {
            let found = true
            for (let up = 0; up <= rowsToCheck; up++) {
                let row1 = rows[row - up];
                let row2 = rows[row + up + 1];
                if (row1 == undefined || row2 == undefined)
                    continue
                if (row1 != row2) {
                    for (let i = 0; i < row1.length; i++) {
                        if (row1[i] != row2[i])
                            smears++
                    }
                }
            }
            if (smears == smearTarget) {
                // console.log("\n\nFound mirror on row " + row + " so score " + (row + 1))
                // for (let row = 0; row < mirror.length; row++) {
                //     console.log(mirror[row].join(""))
                // }
                return row + 1
            }
        }
    }
    // console.log("\nNo mirror on")
    // for (let row = 0; row < mirror.length; row++) {
    //     console.log(mirror[row].join(""))
    // }
    return 0
}

function part1() {
    let score = 0
    let input = file.trim().split("\n\n").map(f => f.split("\n").map(b => b.split("")))
    for (const m of input) {
        let horizontal = 100*findMirror(m, 0);
        let cols = columns(m)
        let vertical = findMirror(cols, 0);
        score += horizontal;
        score += vertical;
    }
    return score
}
function part2() {
    let score = 0
    let input = file.trim().split("\n\n").map(f => f.split("\n").map(b => b.split("")))
    for (const m of input) {
        let horizontal = 100*findMirror(m, 1);
        let cols = columns(m)
        let vertical = findMirror(cols, 1);
        score += horizontal;
        score += vertical;
    }
    return score
}

console.log("Part 1 "+part1())
console.log("Part 2 "+part2())

