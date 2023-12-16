import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2023
const day = 2;

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

let part1 = 0
let part2 = 0
let input = file.trim().split("\n")

for (const f of input) {
    // Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
    let split = f.split(":");
    let gameId = parseInt(split[0].split(" ")[1]);
    let rounds = split[1].trim().split(";").map(d => d.split(", "));
    let possible = true
    let rmax = 0
    let bmax = 0
    let gmax = 0
    for (const round of rounds) {
        let r = 0
        let g = 0
        let b = 0
        for (let i = 0; i < round.length; i++) {
            let dice = round[i].trim().split(" ")
            let color = dice[1];
            let amount = parseInt(dice[0].trim());
            if (color == "red") {
                r += amount
            }
            if (color == "green") {
                g += amount
            }
            if (color == "blue") {
                b += amount
            }
        }
        if (r > 12 || g > 13 || b > 14) {
            possible = false
        }
        rmax = Math.max(r, rmax)
        gmax = Math.max(g, gmax)
        bmax = Math.max(b, bmax)
    }
    if (possible) {
        part1 += gameId
    }
    part2 += rmax * bmax * gmax
}


console.log("Part 1 " + part1)
console.log("Part 2 " + part2)