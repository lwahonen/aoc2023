import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 16;

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

let input = file.trim().split("\n").map(b=>b.split(""))

let up=0
let down=1
let left=2
let right=3

function coord(beam) {
    beam.steps++
    if (beam.dir == up) {
        beam.row--
        return
    }
    if (beam.dir == down) {
        beam.row++
        return;
    }
    if (beam.dir == left) {
        beam.col--
        return;
    }
    if (beam.dir == right) {
        beam.col++
        return;
    }
}

function turnLeft(dir) {
    if (dir == left)
        return up
    if (dir == down)
        return right
    if (dir == right)
        return down
    if (dir == up)
        return left
}

function turnRight(dir) {
    if (dir == left)
        return down
    if (dir == down)
        return left
    if (dir == right)
        return up
    if (dir == up)
        return right
}

function countScoreThisWay(beams) {
    let seen = {}
    while (beams.length > 0) {
        let newBeams = []
        for (const beam of beams) {
            coord(beam)
            if (beam.row < 0 || beam.row >= input.length || beam.col < 0 || beam.col >= input[0].length)
                continue
            let key = `${beam.row},${beam.col},${beam.dir}`;
            if (seen.hasOwnProperty(key))
                continue
            seen[key] = `${beam.row},${beam.col}`
            newBeams.push(beam)
            let c = input[beam.row][beam.col]
            // console.log("Beam at" + JSON.stringify(beam) + " next step is " + c)
            if (c == ".")
                continue
            if (c == "/") {
                beam.dir = turnRight(beam.dir)
            }
            if (c == "\\") {
                beam.dir = turnLeft(beam.dir)
            }
            if (c == "-" && (beam.dir == left || beam.dir == right)) {
                continue
            }
            if (c == "|" && (beam.dir == down || beam.dir == up)) {
                continue
            }
            if (c == "|" && (beam.dir == left || beam.dir == right)) {
                let created = {row: beam.row, col: beam.col, dir: up, steps: 0}
                beam.dir = down
                newBeams.push(created)
            }
            if (c == "-" && (beam.dir == down || beam.dir == up)) {
                let created = {row: beam.row, col: beam.col, dir: right, steps: 0}
                beam.dir = left
                newBeams.push(created)
            }
        }
        beams = newBeams
    }

    let ans = {}
    for (const value of Object.values(seen)) {
        ans[value] = true
    }
    let length = Object.keys(ans).length;
    return length;
}

console.log("Part 1 " + countScoreThisWay( [{row: 0, col: -1, dir: right, steps: 0}]))

let part2=0
for (let row = 0; row < input.length; row++) {
    let beams = [{row: row, col: -1, dir: right, steps: 0}]
    let length = countScoreThisWay(beams);
    part2 = Math.max(part2, length)

    beams = [{row: row, col: input[0].length, dir: left, steps: 0}]
    length = countScoreThisWay(beams);
    part2 = Math.max(part2, length)
}

for (let col = 0; col < input[0].length; col++) {
    let beams = [{row: -1, col: col, dir: down, steps: 0}]
    let length = countScoreThisWay(beams);
    part2 = Math.max(part2, length)

    beams = [{row: input.length, col: col, dir: up, steps: 0}]
    length = countScoreThisWay(beams);
    part2 = Math.max(part2, length)

}


console.log("Part 2 " + part2)