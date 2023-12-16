import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 5;

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

let input = file.trim().split("\n\n")
let maps = {}

for (const mapping of input) {
    if (!mapping.includes("map"))
        continue
    let rows = mapping.split("\n")
    let mapType = rows[0].split(" ")[0];
    maps[mapType] = []
    for (let i = 1; i < rows.length; i++) {
        let row = rows[i]
        let b = row.replaceAll(/\s+/g, " ").split(" ").map(v => parseInt(v))
        maps[mapType].push({
            source_start: b[1],
            source_end: b[1] + b[2] - 1,
            destination_start: b[0],
            destination_end: b[0] + b[2] - 1
        })
    }
}

function doMapping(mapping, point) {
    for (const row of mapping) {
        if (point >= row.source_start && point <= row.source_end) {
            let diff = point - row.source_start
            return row.destination_start + diff
        }
    }
    return point
}

function getLocation(seed) {
    let soil = doMapping(maps['seed-to-soil'], seed)
    let fertilizer = doMapping(maps['soil-to-fertilizer'], soil)
    let water = doMapping(maps['fertilizer-to-water'], fertilizer)
    let light = doMapping(maps['water-to-light'], water)
    let temperature = doMapping(maps['light-to-temperature'], light)
    let humidity = doMapping(maps['temperature-to-humidity'], temperature)
    let location = doMapping(maps['humidity-to-location'], humidity)
    return location;
}

let seeds = input[0].substring("seeds: ".length).split(" ").map(b => parseInt(b))
let part1 = Number.MAX_VALUE

for (const seed of seeds) {
    let location = getLocation(seed);
    part1 = Math.min(location, part1)
}
console.log("Part 1 " + part1)

let part2 = Number.MAX_VALUE

for (let i = 0; i < seeds.length; i += 2) {
    let firstSeed = seeds[i];
    let seedRange = seeds[i + 1];
    let lastSeed = firstSeed + seedRange;
    console.log("\nProcessing range " + firstSeed + " to " + lastSeed)
    for (let seed = firstSeed; seed < lastSeed; seed++) {
        let location = getLocation(seed);
        part2 = Math.min(location, part2)
    }
}

console.log("Part 2 " + part2)
