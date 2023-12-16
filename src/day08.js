import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 8;

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

let split = file.trim().split("\n\n");
let nodes = {}
let input = split[1].split("\n").map(s => {
    let b = /(\w+) = \((\w+), (\w+)\)/.exec(s)
    if (b == null) {
        console.log()
    }
    nodes[b[1]] = {from: b[1], left: b[2], right: b[3]}
    return nodes[b[1]]
})
let path = split[0].split("");

function countStepsFrom(here, endsOnly) {
    let steps = 0
    let first = 0
    while (true) {
        for (let i = 0; i < path.length; i++) {
            let p = path[i]
            if (p == "L") {
                here = nodes[here].left
            }
            if (p == "R") {
                here = nodes[here].right
            }
            steps++
            if (endsOnly.exec(here) != null) {
                if (first == 0) {
                    first = steps
                } else {
                    return {steps: steps, first: first, loop: steps - first};
                }
            }
        }
    }
}

let steps = countStepsFrom("AAA", /ZZZ/);
console.log("Part 1 " + JSON.stringify(steps))
let loops = []
for (const starts of Object.keys(nodes)) {
    if (starts[2] == 'A') {
        let value = countStepsFrom(starts, /..Z/);
        // console.log(JSON.stringify(value))
        loops.push(value.loop)
    }
}

// Javascript program to find LCM of n elements

// Utility function to find
// GCD of 'a' and 'b'
function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Returns LCM of array elements
function findlcm(arr, n) {
    // Initialize result
    let ans = arr[0];

    // ans contains LCM of arr[0], ..arr[i]
    // after i'th iteration,
    for (let i = 1; i < n; i++) {
        ans = (((arr[i] * ans)) /
            (gcd(arr[i], ans)));
    }

    return ans;
}

console.log("Part 2 " + JSON.stringify(findlcm(loops, loops.length)))
