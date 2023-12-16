import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 14;

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
//

let matr=file.trim().split("\n").map(b=>b.split(""))

function rollNorth(matrix) {
    let cols = columns(matrix)

    for (const col of cols) {
        let changed = true
        while (changed) {
            changed = false
            for (let i = 1; i < col.length; i++) {
                let prevSquare = col[i - 1];
                let thisSquare = col[i];
                if (prevSquare == "." && thisSquare == "O") {
                    col[i - 1] = "O"
                    col[i] = "."
                    changed = true
                }
            }
        }
    }
    return columns(cols)
}

function rollWest(matrix) {
    let m=matrix.map(b=>[...b])
    for (const row of m) {
        let changed = true
        while (changed) {
            changed = false
            for (let i = 1; i < row.length; i++) {
                let prevSquare = row[i - 1];
                let thisSquare = row[i];
                if (prevSquare == "." && thisSquare == "O") {
                    row[i - 1] = "O"
                    row[i] = "."
                    changed = true
                }
            }
        }
    }
    return m
}

function rollEast(matrix) {
    let m = matrix.map(b => [...b])
    for (const row of m) {
        let changed = true
        while (changed) {
            changed = false
            for (let i = row.length - 2; i >= 0; i--) {
                let prevSquare = row[i + 1];
                let thisSquare = row[i];
                if (prevSquare == "." && thisSquare == "O") {
                    row[i + 1] = "O"
                    row[i] = "."
                    changed = true
                }
            }
        }
    }
    return m
}

function rollSouth(matrix) {
    let cols = columns(matrix)

    for (const col of cols) {
        let changed = true
        while (changed) {
            changed = false
            for (let i = col.length - 2; i >= 0; i--) {
                let prevSquare = col[i + 1];
                let thisSquare = col[i];
                if (prevSquare == "." && thisSquare == "O") {
                    col[i + 1] = "O"
                    col[i] = "."
                    changed = true
                }
            }
       }
    }
    return columns(cols)
}



function countScore(m) {
    let part = 0
    for (let row = 0; row < m.length; row++) {
        let part1 = m.length - row;
        for (let col = 0; col < m[row].length; col++) {
            if (m[row][col] == "O") {
                part += part1
            }
        }
    }
    return part;
}


let cycles={}

console.log("Part 1 "+countScore(rollNorth(matr)))

for (let cycle = 0; cycle < 1000000000; cycle++) {
    matr = rollNorth(matr)
    matr = rollWest(matr)
    matr = rollSouth(matr)
    matr = rollEast(matr)
    let s = JSON.stringify(matr);
    if (cycles.hasOwnProperty(s)) {
        console.log("Found cycling at " + cycle + " maps to " + cycles[s])
        let cycleLen = cycle - cycles[s]
        while (cycle < 1000000000 - cycleLen)
            cycle += cycleLen
        cycles = {}
    } else
        cycles[s] = cycle
}

console.log("Part 2 "+countScore(matr))
