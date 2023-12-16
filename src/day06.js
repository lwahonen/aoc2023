import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 6;

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


function howFar(time, held) {
    if (held >= time)
        return 0
    if(held <= 0)
        return 0
    return (time - held) * held
}

function binaryPredicate(pred, start, stop) {
    let low = start
    let high = stop;
    while (low < high - 1) {
        let middle = Math.floor(low + ((high - low) / 2));
        if (pred(middle)) {
            high = middle;
        } else {
            low = middle;
        }
    }
    return high
}

let times = file.trim().split("\n")[0].replaceAll(/\s+/g, " ").split(" ").map(b => parseInt(b)).slice(1)
let records = file.trim().split("\n")[1].replaceAll(/\s+/g, " ").split(" ").map(b => parseInt(b)).slice(1)
let score1 = 1

for (let race = 0; race < times.length; race++) {
    let wins = 0
    for (let t = 0; t < times[race]; t++) {
        if (howFar(times[race], t) > records[race])
            wins++
    }
    score1 *= wins
}

let part2Time = parseInt(times.join(""))
let part2Record = parseInt(records.join(""))


let firstFaster = binaryPredicate(b => howFar(part2Time, b) > part2Record, 0, part2Time / 2)
let lastFaster = binaryPredicate(b => howFar(part2Time, b) <= part2Record, part2Time / 2, part2Time);
let score2 = lastFaster - firstFaster
console.log("Part 1 " + score1)
console.log("Part 2 " + score2)
