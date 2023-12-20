import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 20;

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
// file=
//     `
// broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a
// `

let rules = {}
let broadcaster=""
let data = file.trim().split("\n").map(b => {
    let split = b.split("->");
    let targets=split[1].trim().split(", ")
        if(b.startsWith("broadcast")) {
            broadcaster = {op: "=", station: "broadcast",targets:targets, sources:[]};
            return null
        }
        let op=b[0]
        let station=split[0].substring(1).trim()
        let newVar = {op: op, station: station,targets:targets, sources:[]};
        rules[station] = newVar
        return newVar
    }
)

rules["broadcast"]=broadcaster

for (const rule of Object.keys(rules)) {
    for (const target of rules[rule].targets) {
        if(rules.hasOwnProperty(target)) {
            let rule1 = rules[target];
            rule1.sources.push(rule)
        }
    }
}

function handlePulse(state, signal, station, from)
{
    // console.log(from+" -"+signal+"-> "+station +" others at "+JSON.stringify(state))
    if(signal == "high")
        highs++
    if(signal == "low")
        lows++
    if(!rules.hasOwnProperty(station))
        return
    let s=rules[station]
    if(s.op == "%") {
        if(signal == "low") {
            let last = state[s.station]
            let mem = ""
            if (last == undefined)
                last = "low"

            if (last == "low") {
                mem = "high"
            }
            if (last == "high") {
                mem = "low"
            }

            // console.log(station + " turned to " + mem)
            for (const target of s.targets) {
                state[s.station] = mem
                moves.push([state, mem, target, station])
            }
        }
    }
    if(s.op == "&") {
        for (const target of s.targets) {
            let inv = "low"
            for (const source of s.sources) {
                if (state[source] == "low" || state[source] == undefined)
                    inv = "high"
            }
            state[s.station] = inv
            moves.push([state, inv, target, station])
        }
    }
    if(s.op == "=") {
        for (const target of s.targets) {
            moves.push([state, signal, target, station])
        }
    }
}

let part1 = 0
let highs=0
let lows=0
let lastState={}
let moves = []
for (let i = 0; i < 1000; i++) {
    // console.log("\n\nRound "+i)

    moves.push([lastState, "low", "broadcast", "start"])
    while (moves.length > 0) {
        let move = moves.shift()
        lastState = move[0]

        handlePulse(move[0], move[1], move[2], move[3])
    }
}
part1+=highs*lows


// Utility function to find
// GCD of 'a' and 'b'
function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Returns LCM of array elements
function findlcm(arr) {
    // Initialize result
    let ans = arr[0];

    // ans contains LCM of arr[0], ..arr[i]
    // after i'th iteration,
    for (let i = 1; i < arr.length; i++) {
        ans = (((arr[i] * ans)) /
            (gcd(arr[i], ans)));
    }

    return ans;
}

console.log("Part 1 " + part1)

let part2 = 0
lastState={}
let found=false
let loops={}
let largeInverters=[]
for (const rule of Object.values(rules)) {
    if(rule.op == "&" && rule.targets.length >2)
        largeInverters.push(rule.station)
}
while (!found) {
    moves.push([lastState, "low", "broadcast", "start"])
    part2++
    while (moves.length > 0) {
        let move = moves.shift()
        lastState = move[0]
        handlePulse(move[0], move[1], move[2], move[3])
        for (const flip of Object.keys(lastState)) {
            if (rules[flip].op == "&" && lastState[flip] == "low") {
                if (!loops.hasOwnProperty(flip) && largeInverters.includes(flip)) {
                    console.log("Found flip at " + part2 + " for large conjunction " + flip)
                    loops[flip] = part2
                    if(Object.values(loops).length == largeInverters.length) {
                        console.log("Part 2 happens when these flips align, after "+findlcm(Object.values(loops)))
                        found=true
                        break
                    }
                }
            }
        }
    }
}


