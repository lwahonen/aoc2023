import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 21;

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
// file =
//     `
// ...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........
//
// `
let mat = file.trim().split("\n").map(b => b.split(""))


let maxCol = mat[0].length
let maxRow = mat.length

let start = {}
for (let row = 0; row < maxCol; row++) {
    for (let col = 0; col < maxCol; col++) {
        if (mat[row][col] == "S")
            start[`${row},${col}`] = [row, col]
    }
}

function checkNeighbor(nr, nc, nextRound) {
    let checkRow = nr
    let checkCol = nc
    if (checkRow < 0) {
        checkRow += Math.abs(Math.floor(checkRow / (maxRow))) * (maxRow)
    }
    if (checkCol < 0) {
        checkCol += Math.abs(Math.floor(checkCol / (maxCol))) * (maxCol)
    }
    checkRow = checkRow % (maxRow)
    checkCol = checkCol % (maxCol)
    if (mat[checkRow][checkCol] != "#")
        nextRound[`${nr},${nc}`] = [nr, nc]
}

let heights = []
for (let i = 0; i < maxRow * 4 + 10; i++) {
    let nextRound = {}
    let ss = Object.values(start)
    if (i % 100 == 0)
        console.log("Round " + i + " queue length " + ss.length)
    let dx = [-1, 1, 0, 0]
    let dy = [0, 0, -1, 1]
    for (const here of ss) {
        for (let j = 0; j < 4; j++) {
            let nr = here[0] + dx[j]
            let nc = here[1] + dy[j]
            checkNeighbor(nr, nc, nextRound);
        }
    }
    heights[(i + 1)] = Object.keys(nextRound).length
    start = nextRound
}

for (let x = Math.floor(maxRow/2); x < heights.length; x += maxRow) {
    console.log("x=" + x + " f(x)=" + heights[x])
    console.log("part2(x)=" + part2(x))
}

function part2(h) {
    let targetmm = Math.floor(h / maxRow) + 1
    return solveQuad(targetmm)
}

// Wolfram Alpha: findsequence [3882, 34441, 95442, 186885]
function solveQuad(n) {
    return 15221 * (n * n) - 15104 * n + 3765
}

console.log("part2(26501365)=" + part2(26501365))
