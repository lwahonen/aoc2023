import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2023
const day = 12;

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

let cache={}
function springs(s, index, run, head, target) {
    // Cull impossible heads
    for (let i = 0; i < head.length; i++) {
        if (head[i] != target[i])
            return 0
    }
    let cacheKey = null;
    if (run == 0) {
        cacheKey = s.substring(index) + "  [" + head.join(",") + "]"
        if (cache.hasOwnProperty(cacheKey))
            return cache[cacheKey]
    }

    head = [...head]
    if (index == s.length) {
        if (run != 0)
            head.push(run)
        if (head.length != target.length)
            return 0
        for (let i = 0; i < head.length; i++) {
            if (head[i] != target[i])
                return 0
        }
        return 1
    }
    let score = 0
    if (s[index] == ".") {
        if (run != 0) {
            head.push(run)
        }
        score += springs(s, index + 1, 0, head, target)
    }
    if (s[index] == "#") {
        score += springs(s, index + 1, run + 1, head, target)
    }
    if (s[index] == "?") {
        // Guess #
        score += springs(s, index + 1, run + 1, head, target)
        // Guess .
        if (run != 0) {
            head.push(run)
        }
        score += springs(s, index + 1, 0, head, target)
    }
    // Only cache when no run was going
    if (cacheKey != null) {
        cache[cacheKey] = score
    }
    return score
}

let part1=0
let split = file.trim().split("\n").map(b=>b.split(" "))
for (const row of split) {
    let target = row[1].split(",").map(f => parseInt(f))
    cache={}
    let part =springs(row[0], 0, 0,[], target)
    // console.log("Result for " + row + " is " + part)
    part1 += part
}
console.log("Part 1 "+part1)

let part2=0
for (const row of split) {
    let target = row[1].split(",").map(f => parseInt(f))
    target = Array.apply(null, Array(5)).map(_ =>target).flat() // ['abc', 'abc', 'abc']
    let s = Array.apply(null, Array(5)).map(_ =>row[0]).join("?")
    cache={}
    let part =springs(s, 0, 0,[], target)
    // console.log("Part 2 for " + s + " is " + part+" original was "+r+" target now "+target)
    part2 += part
}
console.log("Part 2 "+part2)
