import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 23;

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
// #.#####################
// #.......#########...###
// #######.#########.#.###
// ###.....#.>.>.###.#.###
// ###v#####.#v#.###.#.###
// ###.>...#.#.#.....#...#
// ###v###.#.#.#########.#
// ###...#.#.#.......#...#
// #####.#.#.#######.#.###
// #.....#.#.#.......#...#
// #.#####.#.#.#########v#
// #.#...#...#...###...>.#
// #.#.#v#######v###.###v#
// #...#.>.#...>.>.#.###.#
// #####v#.#.###v#.#.###.#
// #.....#...#...#.#.#...#
// #.#########.###.#.#.###
// #...###...#...#...#.###
// ###.###.#.###v#####v###
// #...#...#.#.>.>.#.>.###
// #.###.###.#.###.#.#v###
// #.....###...###...#...#
// #####################.#
// `
let mat = file.trim().split("\n").map(b => b.split(""))

function getMove(dr, dc, move) {
    let nextCol = move.col + dc;
    let nextRow = move.row + dr;
    if (mat[nextRow][nextCol] != "#") {
        if (!move.visited.hasOwnProperty(`${nextRow},${nextCol}`)) {
            let v = structuredClone(move)
            v.visited[`${move.row},${move.col}`] = true
            v.cost = move.cost + 1
            v.row = nextRow
            v.col = nextCol
            return v
        }
    }
    return null
}


function maxDist(nextSteps, part2) {
    let foundMore = false
    while (nextSteps.length > 0) {
        let nextStep = nextSteps.pop()
        let row = nextStep.row
        let col = nextStep.col
        let here = mat[row][col];
        if (here != "#") {
            let r = []
            if (row > 0) {
                let up = part2 || here == "^" || here == "."
                if (up) {
                    let step = getMove(-1, 0, nextStep);
                    if (step != null) {
                        r.push(step)
                    }
                }
            }
            if (row < mat.length - 1) {
                let down = part2 || here == "v" || here == "."
                if (down) {
                    let step = getMove(1, 0, nextStep);
                    if (step != null) {
                        r.push(step)
                    }
                }
            }
            if (col > 0) {
                let left = part2 || here == "<" || here == "."
                if (left) {
                    let step = getMove(0, -1, nextStep);
                    if (step != null) {
                        r.push(step)
                    }
                }
            }
            if (col < mat[0].length - 1) {
                let right = part2 || here == ">" || here == "."
                if (right) {
                    let step = getMove(0, 1, nextStep);
                    if (step != null) {
                        r.push(step)
                    }
                }
            }
            // Not an intersection
            let finishRow = nextStep.row == mat.length - 1
            if (!finishRow && (r.length < 2 || nextStep.cost == 0))
                nextSteps.push(...r)
            else {
                let fk = `${nextStep.fromRow},${nextStep.fromCol}`
                let tk = `${nextStep.row},${nextStep.col}`
                if (!cache.hasOwnProperty(fk))
                    cache[fk] = {}
                if (!cache.hasOwnProperty(tk))
                    cache[tk] = {}
                let prevVal = {row: nextStep.row, col: nextStep.col, cost: nextStep.cost, tokey: tk};
                let newVertex = JSON.stringify(prevVal);
                if (!cache[fk].hasOwnProperty(newVertex)) {
                    console.log("Found path from " + fk + " to " + tk + " cost " + nextStep.cost)
                    cache[fk][newVertex] = prevVal
                    foundMore = true
                }
                interSections[tk] = {row: nextStep.row, col: nextStep.col}
            }
        }
    }
    return foundMore
}


let best=0
let cache={}
let interSections={}
function fillCache(part2) {
    best = 0
    cache = {}
    interSections={}
    interSections["0,1"]={row:0,col:1}
    let processed = []
    let changed = true

    while (changed) {
        changed = false
        for (const key of Object.keys(interSections)) {
            if (processed.includes(key))
                continue
            processed.push(key)
            let test = interSections[key]
            let moreArcs = maxDist([{
                fromRow: test.row,
                fromCol: test.col,
                row: test.row,
                col: test.col,
                visited: {},
                cost: 0
            }], part2)
            changed = moreArcs || changed
        }
    }
}

function maxPath(keyHere, costHere, lastVisits) {
    let row = interSections[keyHere].row;
    if(row == mat.length-1) {
        if (costHere > best) {
            best = costHere
            // console.log("Found longer " + costHere)
        } else {
            // console.log("Found worse path " + costHere)
        }
        return
    }
    let potentials = cache[keyHere]
    let visitsNow = structuredClone(lastVisits);
    visitsNow.push(keyHere)
    for (const potential of Object.values(potentials)) {
        if (!visitsNow.includes(potential.tokey))
            maxPath(potential.tokey, potential.cost + costHere, visitsNow)
    }
}
fillCache(false)
maxPath("0,1", 0, [])
console.log("\nPart 1 "+best+"\n\n")
fillCache(true)
maxPath("0,1", 0, [])
console.log("\nPart 2 "+best)
