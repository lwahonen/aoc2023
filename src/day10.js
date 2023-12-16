import {fetchInputData} from "./libraries.js";
import {toUnicode} from "punycode";

const year = 2023
const day = 10;

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

// file=
//     `
// ...........
// .S-------7.
// .|F-----7|.
// .||.....||.
// .||.....||.
// .|L-7.F-J|.
// .|..|.|..|.
// .L--J.L--J.
// ...........
// `

let d = file.trim().split("\n").map(b => b.split(""))

let start = {row: 0, col: 0}
let maxCol = d[0].length;
for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < maxCol; col++) {
        if (d[row][col] == "S") {
            start = {row: row, col: col, dist: 0}
            break
        }
    }
}

let visit = []
let distances = {}
let key = `${start.row},${start.col}`
visit.push({row: start.row - 1, col: start.col, dist: 1})
visit.push({row: start.row + 1, col: start.col, dist: 1})
// visit.push({row:start.row, col:start.col-1, dist:1})
// visit.push({row:start.row, col:start.col+1, dist:1})

function mutates(v, states, distances, visit) {
    for (const state of states) {
        let rowMod = state.row;
        let colMod = state.col;
        visit.push({row: v.row + rowMod, col: v.col + colMod, dist: v.dist + 1, from: v})
    }
}

let fseen = {}

function getPoint(trueRow, trueCol) {
    if (trueRow >= d.length || trueRow < 0) {
        return " "
    }
    if (trueCol >= maxCol || trueCol < 0) {
        return " "
    }
    let neighBor = d[trueRow][trueCol];
    if(neighBor == ".") {
        d[trueRow][trueCol] = " "
        neighBor = " "
    }
    return neighBor
}

let seenclean = {}

function cleanUp(from, floded) {
    let row = from.row
    let col = from.col
    let neighBor = getPoint(row, col)
    if (from.right == true && from.top == true) {
        if (neighBor == " ") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            return;
        }
        if (neighBor == "|") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "-") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            return;
        }
        if (neighBor == "7") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            return;
        }
        if (neighBor == "J") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "F") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            return;
        }
        if (neighBor == "L") {
            // Up
            floded.push({row: row - 1, col: col, left: false, right: true, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: false, top: true})
            return;
        }
    }


    if (from.left == true && from.top == true) {
        if (neighBor == " ") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "|") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "-") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "7") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "J") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "F") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Down
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "L") {
            // Up
            floded.push({row: row - 1, col: col, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: false, top: true})
            return;
        }
    }


    if (from.right == true && from.bottom == true) {
        if (neighBor == " ") {
            // Up
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            return;
        }
        if (neighBor == "|") {
            // Up
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "-") {
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            return;
        }
        if (neighBor == "7") {
            // Up
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "J") {
            // Up
            floded.push({row: row, col: col, left: false, right: true, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            return;
        }
        if (neighBor == "F") {
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            return;
        }
        if (neighBor == "L") {
            // Right
            floded.push({row: row, col: col + 1, left: true, right: false, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: false, right: true, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col, left: true, right: false, bottom: true, top: false})
            return;
        }
    }


    if (from.left == true && from.bottom == true) {
        if (neighBor == " ") {
            // Up
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "|") {
            // Up
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "-") {
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "7") {
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "J") {
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "F") {
            // Up
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
        if (neighBor == "L") {
            // Up
            floded.push({row: row, col: col, left: true, right: false, bottom: false, top: true})
            // Right
            floded.push({row: row, col: col, left: false, right: true, bottom: true, top: false})
            // Down
            floded.push({row: row + 1, col: col, left: true, right: false, bottom: false, top: true})
            // Left
            floded.push({row: row, col: col - 1, left: false, right: true, bottom: true, top: false})
            return;
        }
    }
}


let seen = {}
let top = {dist: 0}

while (visit.length > 0) {
    let v = visit.pop()
    if (v.row < 0) {
        continue
    }
    if (v.row >= d.length) {
        continue
    }
    if (v.col < 0) {
        continue
    }
    if (v.col >= maxCol) {
        continue
    }
    let mapElement = d[v.row][v.col];
    v.tile = mapElement
    if (mapElement == "S") {
        if (v.dist > top.dist) {
            top = v
        }
        continue
    }
    let key = `${v.row},${v.col}`
    if (seen.hasOwnProperty(key)) {
        continue
    }
    seen[key] = v
    if (mapElement == "|") {
        mutates(v, [{row: -1, col: 0}, {row: +1, col: 0}], distances, visit)
    }
    if (mapElement == "-") {
        mutates(v, [{row: 0, col: -1}, {row: 0, col: +1}], distances, visit)
    }
    if (mapElement == "L") {
        mutates(v, [{row: -1, col: 0}, {row: 0, col: +1}], distances, visit)
    }
    if (mapElement == "J") {
        mutates(v, [{row: -1, col: 0}, {row: 0, col: -1}], distances, visit)
    }
    if (mapElement == "7") {
        mutates(v, [{row: +1, col: 0}, {row: 0, col: -1}], distances, visit)
    }
    if (mapElement == "F") {
        mutates(v, [{row: +1, col: 0}, {row: 0, col: +1}], distances, visit)
    }
}

console.log("Part 1 "+top.dist / 2)
let s = top

function toUnicodeMap(tile) {
    if (tile == "-") {
        return "─"
    }
    if (tile == "|") {
        return "│"
    }
    if (tile == "L") {
        return "└"
    }
    if (tile == "J") {
        return "┘"
    }
    if (tile == "7") {
        return "┐"
    }
    if (tile == "F") {
        return "┌"
    }
    if (tile == "S") {
        return "█"
    }
    return tile;
}

let mainloop = {}
while (s != undefined) {
    mainloop[`${s.row},${s.col}`] = true
    s = s.from
}

let flodQue = []
for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < maxCol; col++) {
        let isProtected = mainloop.hasOwnProperty(`${row},${col}`)
        if (isProtected) {
            continue
        }
        d[row][col] = "."
    }
}
for (let col = 0; col < maxCol; col++) {
    flodQue.push({row: -1, col: col, left: false, right: true, bottom: true, top: false})
    flodQue.push({row: -1, col: col, left: true, right: true, bottom: true, top: false})

    flodQue.push({row: d.length, col: col, left: true, right: false, bottom: false, top: true})
    flodQue.push({row: d.length, col: col, left: false, right: true, bottom: false, top: true})
}
for (let row = 0; row < d.length; row++) {
    flodQue.push({row: row, col: -1, left: false, right: true, bottom: true, top: false})
    flodQue.push({row: row, col: -1, left: false, right: true, bottom: false, top: true})

    flodQue.push({row: row, col: maxCol, left: true, right: false, bottom: true, top: false})
    flodQue.push({row: row, col: maxCol, left: true, right: false, bottom: false, top: true})
}
//
// flodQue=[]
while (flodQue.length > 0) {
    let r = flodQue.pop()
    let moreStates = []
    cleanUp(r, moreStates)
    for (const state of moreStates) {
        let key = JSON.stringify(state)
        if (seenclean.hasOwnProperty(key)) {
            continue;
        }
        if (state.row < 0)
            continue
        if (state.row >= d.length)
            continue
        if (state.col < 0)
            continue
        if (state.col >= maxCol)
            continue
        state.tile = getPoint(state.row, state.col)
        seenclean[key] = true
        flodQue.push(state)
    }
}

let p2 = 0

for (let row = 0; row < d.length; row++) {
    let s = ""
    for (let col = 0; col < maxCol; col++) {
        let dElementElement = d[row][col];
        if (dElementElement == ".") {
            p2 += 1
        }
        s += toUnicodeMap(dElementElement)
    }
    console.log(s)
}
console.log("Part 2 "+p2)