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

function part2Neigh(move, minSameDir, maxSameDir) {
    let row = move.row
    let col = move.col
    let n = []
    let oldDir = move.dir;
    if (oldDir == up || oldDir == down|| oldDir == "start") {
        for (let i = minSameDir; i <= maxSameDir; i++) {
            if (col + i <= maxCol - 1) {
                n.push({row: row, col: col + i, dir: right})
            }
        }
    }
    if (oldDir == up || oldDir == down|| oldDir == "start") {
        for (let i = minSameDir; i <= maxSameDir; i++) {
            if (col - i >= 0) {
                n.push({row: row, col: col - i, dir: left})
            }
        }
    }


    if (oldDir == left || oldDir == right|| oldDir == "start") {
        for (let i = minSameDir; i <= maxSameDir; i++) {
            if (row + i <= input.length - 1) {
                n.push({row: row + i, col: col, dir: down})
            }
        }
    }
    if (oldDir == left || oldDir == right|| oldDir == "start") {
        for (let i = minSameDir; i <= maxSameDir; i++) {
            if (row - i >= 0) {
                n.push({row: row - i, col: col, dir: up})
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
    let v = `${toHash.row},${toHash.col},${toHash.dir}`
    toHash.hashKey = v
    return v
}

let openKeys={}
let sorted=false
function A_Star(minSteps, maxSteps) {
// The set of discovered nodes that may need to be (re-)expanded.
// Initially, only the start node is known.
// This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openSet = [{
        row: 0,
        col: 0,
        dir: "start",
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
            return {score:gScore[currentKey], reach:currentKey}

        let gScoreCurrent = gScore.hasOwnProperty(currentKey) ? gScore[currentKey] : Number.MAX_VALUE

        for (const neighbor of part2Neigh(current, minSteps, maxSteps)) {
            let a_key = getKey(neighbor)
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            let more = 0
            if (neighbor.dir == right) {
                for (let i = current.col + 1; i <= neighbor.col; i++) {
                    more += input[neighbor.row][i]
                }
            }
            if (neighbor.dir == left) {
                for (let i = current.col - 1; i >= neighbor.col; i--) {
                    more += input[neighbor.row][i]
                }
            }
            if (neighbor.dir == down) {
                for (let i = current.row + 1; i <= neighbor.row; i++) {
                    more += input[i][neighbor.col]
                }
            }
            if (neighbor.dir == up) {
                for (let i = current.row - 1; i >= neighbor.row; i--) {
                    more += input[i][neighbor.col]
                }
            }

            let tentative_gScore = gScoreCurrent + more

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

console.log("Part 1 " + JSON.stringify(A_Star(1, 3).score))
console.log("Part 2 " + JSON.stringify(A_Star(4,10).score))