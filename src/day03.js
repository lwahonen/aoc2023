import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 3;

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


let input = file.trim().split("\n");
function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function findNumber(row, col) {
    if (row < 0 || row >= input.length) {
        return {start: col, end: col, number: 0}
    }
    let charHere = input[row][col];
    if (isCharNumber(charHere)) {
        let left = col;
        let right = col;
        let s = charHere
        while (true) {
            if (left > 0 && isCharNumber(input[row][left - 1])) {
                left--
                s = input[row][left]+ s
                continue
            }
            if (isCharNumber(input[row][right + 1])) {
                right++
                s = s + input[row][right]
                continue
            }
            return {start: left, end: right, number: parseInt(s)}
        }
    }
    return {start: col, end: col, number: 0}
}

let part1 = 0
let part2 = 0
for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
        let found = findNumber(row, col)
        if (found.number == 0) {
            continue
        }
        // console.log(`Found number ${found.number} at row ${row} cols ${col}-${found.end}`)
        let add = false
        for (let neighCol = col - 1; neighCol < found.end + 2; neighCol++) {
            for (let neighRow = row - 1; neighRow < row + 2; neighRow++) {
                if (neighRow < 0) {
                    continue
                }
                if (neighRow >= input.length) {
                    continue
                }
                let neighbor = input[neighRow][neighCol];
                if (neighbor == ".") {
                    continue
                }
                if (neighbor == undefined) {
                    continue
                }
                if (isCharNumber(neighbor)) {
                    continue
                }
                // console.log("Found symbol " + neighbor)
                add = true
            }
        }
        if (add) {
            part1 += found.number
        }
        col = found.end
    }
}

for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
        if (input[row][col] != "*") {
            continue
        }

        // console.log(`Found star at row ${row} col ${col}`)
        let numcount = 0
        let product = 1
        for (let j = row - 1; j < row + 2; j++) {
            for (let i = col - 1; i < col + 2; i++) {
                let found = findNumber(j, i)
                if (found.number == 0) {
                    continue
                }
                i = found.end + 1
                product *= found.number
                numcount++
                // console.log(`Found number ${found.number} at row ${j} cols ${found.start}-${found.end}`)
            }
        }
        if (numcount == 2) {
            part2 += product
        }
    }
}


console.log("Part 1 " + part1)
console.log("Part 2 " + part2)
