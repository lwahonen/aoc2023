import {columns, fetchInputData} from "./libraries.js";
import md5 from "blueimp-md5";

const year = 2023
const day = 4;

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
// file=`
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `

let cards = {}
let input = file.trim().split("\n").map(f => {
    let s = f.split(": ")
    let id = parseInt(s[0].substring(5).trim());
    let sElement = s[1].replace(/[ ]+/g, " ");
    let winners = sElement.split(" | ")[0].trim().split(" ").map(b => parseInt(b))
    let losers = sElement.split(" | ")[1].trim().split(" ").map(b => parseInt(b))
    let card = {id: id, winners: winners, losers: losers, original: f};
    cards[id] = card
    return card
})

let scores = {}
let part1 = 0
for (const card of input) {
    let wcard = 0;
    for (let i = 0; i < card.losers.length; i++) {
        if (card.winners.includes(card.losers[i])) {
            wcard++;
        }
    }
    scores[card.id] = wcard
    if (wcard > 0) {
        part1 += Math.pow(2, wcard - 1)
    }
}

let part2Cache = {}
function scoreCard(id) {
    let total = 1
    for (let i = 0; i < scores[id]; i++) {
        let nextId = id + 1 + i;
        total += part2Cache[nextId]
    }
    part2Cache[id] = total
    return total
}

let part2 = 0
for (let i = input.length; i >= 1; i--) {
    part2 += scoreCard(i)
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)
