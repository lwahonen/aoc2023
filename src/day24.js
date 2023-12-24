import {fetchInputData} from "./libraries.js";
import engine from "thaw-sieve-of-eratosthenes";

const year = 2023
const day = 24;

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
// file =
//     `
// 19, 13, 30 @ -2,  1, -2
// 18, 19, 22 @ -1, -1, -2
// 20, 25, 34 @ -2, -2, -4
// 12, 31, 28 @ -1, -2, -1
// 20, 19, 15 @  1, -5, -3
// `
let mat = file.trim().split("\n").map(x => {
    let strings = x.split("@");
    let pos = strings[0].split(", ").map(x => parseInt(x))
    let vel = strings[1].split(", ").map(x => parseInt(x))
    return {pos: pos, vel: vel}
})

let part1 = 0

function crashPoint(a, b, c, d) {

    let a1 = b.y - a.y
    let b1 = a.x - b.x
    let c1 = a1 * a.x + b1 * a.y

    let a2 = d.y - c.y
    let b2 = c.x - d.x
    let c2 = a2 * c.x + b2 * c.y

    let determinant = a1 * b2 - a2 * b1

    if (determinant == 0) {
        return false
    }
    let x = (b2 * c1 - b1 * c2) / determinant
    let y = (a1 * c2 - a2 * c1) / determinant
    return {x, y}
}

let min = 200000000000000
let max = 400000000000000
for (let i = 0; i < mat.length - 1; i++) {
    for (let j = i + 1; j < mat.length; j++) {
        let hail = mat[i]
        let first_start_x = hail.pos[0]
        let first_start_y = hail.pos[1]
        let first_end_x = hail.pos[0] + hail.vel[0]
        let first_end_y = hail.pos[1] + hail.vel[1]

        let sec = mat[j]
        let sec_start_x = sec.pos[0]
        let sec_start_y = sec.pos[1]
        let sec_end_x = sec.pos[0] + sec.vel[0]
        let sec_end_y = sec.pos[1] + sec.vel[1]
        let crash = crashPoint({x: first_start_x, y: first_start_y},
            {x: first_end_x, y: first_end_y,},
            {x: sec_start_x, y: sec_start_y},
            {x: sec_end_x, y: sec_end_y}
        )
        if (crash == false) {
            continue
        }
        // console.log("Crash between " + JSON.stringify(hail) + " and " + JSON.stringify(sec))
        let crash_direction_x = Math.sign(crash.x - hail.pos[0])
        let crash_direction_y = Math.sign(crash.y - hail.pos[1])
        if (Math.sign(hail.vel[0]) != crash_direction_x) {
            // console.log("Moving away")
            continue
        }
        if (Math.sign(hail.vel[1]) != crash_direction_y) {
            // console.log("Moving away")
            continue
        }

        crash_direction_x = Math.sign(crash.x - sec.pos[0])
        crash_direction_y = Math.sign(crash.y - sec.pos[1])
        if (Math.sign(sec.vel[0]) != crash_direction_x) {
            // console.log("Moving away")
            continue
        }

        if (Math.sign(sec.vel[1]) != crash_direction_y) {
            // console.log("Moving away")
            continue
        }

        if (crash.x > min && crash.x < max && crash.y > min && crash.y < max) {
            // console.log("Crash INSIDE " + JSON.stringify(crash))
            part1++
        } else {
            // console.log("Crash OUTSIDE " + JSON.stringify(crash))
        }
    }
}

function primeFactors(n) {
    const factors = [];
    let divisor = 2;

    while (n >= 2) {
        if (n % divisor == 0) {
            factors.push(divisor);
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    return factors;
}

// These are the constants we want Z3
// to figure out for us to solve part 2
console.log("(declare-const x0 Int)")
console.log("(declare-const y0 Int)")
console.log("(declare-const z0 Int)")
// Z3 also needs to keep these constant
// to only have exactly one solution
console.log("(declare-const vx0 Int)")
console.log("(declare-const vy0 Int)")
console.log("(declare-const vz0 Int)")
// Every hailstone has a well-defined moment for
// when that hailstone hits the rock
for (let j = 0; j < mat.length; j++) {
    console.log(`(declare-const hit_moment_${j} Int)`)
}
for (let i = 0; i < mat.length; i++) {
    let hail = mat[i]
    // Assertion 1: At time hit_moment_N
    // the rock's initial position X + hit_moment_N * rock velocity X
    // equals hailstone N initial position X + hit_moment_N * hailstone velocity X
    console.log(`(assert (= (+ ${hail.pos[0]} (* hit_moment_${i} ${hail.vel[0]})) (+ x0 (* hit_moment_${i} vx0))))`)
    // Same for Y
    console.log(`(assert (= (+ ${hail.pos[1]} (* hit_moment_${i} ${hail.vel[1]})) (+ y0 (* hit_moment_${i} vy0))))`)
    // And Z
    console.log(`(assert (= (+ ${hail.pos[2]} (* hit_moment_${i} ${hail.vel[2]})) (+ z0 (* hit_moment_${i} vz0))))`)
}
// Please do the needful
console.log('(check-sat) (get-model)')
// And calculate the part 2 answer for us too
console.log('(eval (+ x0 y0 z0))')


console.error("Part 1 solution is "+part1)
console.error("Part 2 solution you get from z3 solver. Run it as this:\nnode day24.js|z3 -in")
