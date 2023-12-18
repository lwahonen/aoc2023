import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 18;

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
let input = file.trim().split("\n").map(b => b.split(" "))

let row = 0
let col = 0

let lineLen = 0
let corners = []

for (const inst of input) {
    let dir = inst[0]
    let amount = parseInt(inst[1])
    lineLen += amount
    if (dir == "R") {
        col = col + amount;
    }
    if (dir == "L") {
        col = col - amount;
    }
    if (dir == "U") {
        row = row - amount;
    }
    if (dir == "D") {
        row = row + amount;
    }
    corners.push([row, col])
}

let secondLineLen = 0
let secondCorners = []
for (const inst of input) {
    let string = inst[2].substring(2, 7);
    let amount = parseInt(string, 16)
    secondLineLen += amount
    let dirVal = inst[2][7];
    let dir;
    if (dirVal == 0)
        dir = "R"
    if (dirVal == 1)
        dir = "D"
    if (dirVal == 2)
        dir = "L"
    if (dirVal == 3)
        dir = "U"

    if (dir == "R") {
        col = col + amount;
    }
    if (dir == "L") {
        col = col - amount;
    }
    if (dir == "U") {
        row = row - amount;
    }
    if (dir == "D") {
        row = row + amount;
    }
    secondCorners.push([row, col])
}


// Shoelace
function area(corners) {
    let n = corners.length
    let area = 0
    for (let i = 0; i < n; i++) {
        let j = (i + 1) % n
        area += corners[i][0] * corners[j][1]
        area -= corners[j][0] * corners[i][1]
    }
    area = Math.abs(area) / 2.0
    return area
}

let part1 = area(corners) + (lineLen / 2) + 1;
console.log("Part 1 " + part1)
let part2 = area(secondCorners) + (secondLineLen / 2) + 1;
console.log("Part 2 " + part2)
