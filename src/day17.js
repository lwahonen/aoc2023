import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 17;

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

let input = file.trim().split("\n").map(b => b.split("").map(w => parseInt(w)))

let maxCol = input[0].length
let up = "up"
let down = "down"
let left = "left"
let right = "right"


function ultra(oldDir, sameDir, newDir) {
    if (oldDir == "start") {
        return true;
    }
    let maxSameDir = 10;
    let minSameDir = 4;
    let canGoStraight = oldDir == newDir && sameDir < maxSameDir;
    let canTurn = oldDir != newDir && sameDir >= minSameDir;
    return canGoStraight || canTurn;
}

function part2Neigh(move) {
    let row = move.row
    let col = move.col
    let n = []
    let oldDir = move.dir;
    if (col < maxCol - 1) {
        if (oldDir != left) {
            let sameDir = oldDir == right ? move.sameDir + 1 : 1
            let allowed = ultra(oldDir, move.sameDir, right);
            if (allowed) {
                n.push({row: row, col: col + 1, dir: right, sameDir: sameDir})
            }
        }
    }
    if (row < input.length - 1) {
        if (oldDir != up) {
            let sameDir = oldDir == down ? move.sameDir + 1 : 1
            let allowed = ultra(oldDir, move.sameDir, down);
            if (allowed) {
                n.push({row: row + 1, col: col, dir: down, sameDir: sameDir})
            }
        }
    }
    if (col > 0) {
        if (oldDir != right) {
            let sameDir = oldDir == left ? move.sameDir + 1 : 1
            let allowed = ultra(oldDir, move.sameDir, left);
            if (allowed) {
                n.push({row: row, col: col - 1, dir: left, sameDir: sameDir})
            }
        }
    }
    if (row > 0) {
        if (oldDir != down) {
            let sameDir = oldDir == up ? move.sameDir + 1 : 1
            let allowed = ultra(oldDir, move.sameDir, up);
            if (allowed) {
                n.push({row: row - 1, col: col, dir: up, sameDir: sameDir})
            }
        }
    }
    return n
}

function neighbors(move) {
    let row = move.row
    let col = move.col
    let n = []
    let oldDir = move.dir;
    let maxSameDir = 4;
    if (col < maxCol - 1) {
        if (oldDir != left) {
            let sameDir = oldDir == right ? move.sameDir + 1 : 1
            if (sameDir < maxSameDir) {
                n.push({row: row, col: col + 1, dir: right, sameDir: sameDir})
            }
        }
    }
    if (row < input.length - 1) {
        if (oldDir != up) {
            let sameDir = oldDir == down ? move.sameDir + 1 : 1
            if (sameDir < maxSameDir) {
                n.push({row: row + 1, col: col, dir: down, sameDir: sameDir})
            }
        }
    }
    if (col > 0) {
        if (oldDir != right) {
            let sameDir = oldDir == left ? move.sameDir + 1 : 1
            if (sameDir < maxSameDir) {
                n.push({row: row, col: col - 1, dir: left, sameDir: sameDir})
            }
        }
    }
    if (row > 0) {
        if (oldDir != down) {
            let sameDir = oldDir == up ? move.sameDir + 1 : 1
            if (sameDir < maxSameDir) {
                n.push({row: row - 1, col: col, dir: up, sameDir: sameDir})
            }
        }
    }
    return n
}

let targetRow = input.length - 1
let targetCol = maxCol - 1

function h(row, col) {
    return Math.abs(targetRow - row) + Math.abs(targetCol - col)
}

function getKey(toHash) {
    if (toHash.hasOwnProperty("hashKey"))
        return toHash.hashKey
    let v = `${toHash.row},${toHash.col},${toHash.dir},${toHash.sameDir}`
    toHash.hashKey = v
    return v
}

let openKeys={}
let sorted=false
function A_Star(neighFunc) {
// The set of discovered nodes that may need to be (re-)expanded.
// Initially, only the start node is known.
// This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openSet = [{
        row: 0,
        col: 0,
        dir: "start",
        sameDir: 0,
        total: 0,
        distToGoal: Number.MAX_VALUE
    }]

// For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
// to n currently known.
    let cameFrom = {}

// For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore = {}
    gScore[getKey(openSet[0])] = 0

// For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
// how cheap a path could be from start to finish if it goes through n.
    let fScore = {}
    fScore[getKey(openSet[0])] = h(0, 0)

    while (openSet.length > 0) {
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        openSet = openSet.sort((a, b) => {
                let a_key = getKey(a)
                let b_key = getKey(b)
                let aVal = fScore.hasOwnProperty(a_key) ? fScore[a_key] : Number.MAX_VALUE
                let bVal = fScore.hasOwnProperty(b_key) ? fScore[b_key] : Number.MAX_VALUE
                a.fScore = aVal
                b.fScore = bVal
                return aVal - bVal
            }
        )
        let current = openSet.shift()
        let currentKey = getKey(current);
        delete openKeys[currentKey]
        if (current.row == targetRow && current.col == targetCol)
            return gScore[currentKey]

        let gScoreCurrent = gScore.hasOwnProperty(currentKey) ? gScore[currentKey] : Number.MAX_VALUE

        for (const neighbor of neighFunc(current)) {
            let a_key = getKey(neighbor)
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore = gScoreCurrent + input[neighbor.row][neighbor.col]

            let gScoreElement = gScore.hasOwnProperty(a_key) ? gScore[a_key] : Number.MAX_VALUE
            if (tentative_gScore < gScoreElement) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[a_key] = current
                gScore[a_key] = tentative_gScore
                fScore[a_key] = tentative_gScore + h(neighbor.row, neighbor.col)

                let add = true
                if (!openKeys.hasOwnProperty(a_key)) {
                    openSet.push(neighbor)
                    openKeys[a_key]=true
                }
            }
        }
    }
    return Number.MAX_VALUE
}

console.log("Part 1 " + JSON.stringify(A_Star(neighbors)))
console.log("Part 2 " + JSON.stringify(A_Star(part2Neigh)))