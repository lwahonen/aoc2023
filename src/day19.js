import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 19;

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
//     px{a<2006:qkq,m>2090:A,rfg}
// pv{a>1716:R,A}
// lnx{m>1548:A,A}
// rfg{s<537:gd,x>2440:R,A}
// qs{s>3448:A,lnx}
// qkq{x<1416:A,crn}
// crn{x>2662:A,R}
// in{s<1351:px,qqz}
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}
//
// {x=787,m=2655,a=1222,s=2876}
// {x=1679,m=44,a=2067,s=496}
// {x=2036,m=264,a=79,s=2244}
// {x=2461,m=1339,a=466,s=291}
// {x=2127,m=1623,a=2188,s=1013}`

let rules = {}
let data = file.trim().split("\n\n")[0].split("\n").map(b => {
        //         br{x>2184:A,s>3693:A,s>3530:R,A}
        let split = b.split("{");
        let name = split[0]
        let r = split[1].substring(0, split[1].length - 1).split(",")
        let newVar = {name: name, rules: r};
        rules[name] = newVar
        return newVar
    }
)

function parseLt(steps) {
    let strings = steps.split("<");
    let key = strings[0]
    let split = strings[1].split(":");
    let value = parseInt(split[0])
    let target = split[1];
    return {key, value, target};
}

function parseGt(steps) {
    let strings = steps.split(">");
    let key = strings[0]
    let split = strings[1].split(":");
    let value = parseInt(split[0])
    let target = split[1];
    return {key, value, target};
}


function rank(s) {
    let rule = rules["in"]
    while (true) {
        for (const steps of rule.rules) {
            if (steps.includes("<")) {
                let {key, value, target} = parseLt(steps);
                if (s[key] < value) {
                    if (target == "R")
                        return "R"
                    if (target == "A")
                        return "A"
                    rule = rules[target]
                    break
                }
                continue
            }
            if (steps.includes(">")) {
                let {key, value, target} = parseGt(steps);
                if (s[key] > value) {
                    if (target == "R")
                        return "R"
                    if (target == "A")
                        return "A"
                    rule = rules[target]
                    break
                }
                continue
            }
            let target = steps
            if (target == "R")
                return "R"
            if (target == "A")
                return "A"
            rule = rules[target]
            break
        }
    }
}


let parts = file.trim().split("\n\n")[1].split("\n").map(b => b.substring(1, b.length - 1).split(","))

let part1 = 0
for (const part of parts) {
    let h = {}
    for (const s of part) {
        let strings = s.split("=");
        let n = strings[0]
        h[n] = parseInt(strings[1])
    }
    if (rank(h) == "A") {
        for (const value of Object.values(h)) {
            part1 += value
        }
    }
}
console.log("Part 1 " + part1)

// Split the ranges by the limit
function inspect(key, op, limit, ranges) {
    let n = []
    for (const oldRange of ranges) {
        let low = oldRange[key].low
        let high = oldRange[key].high
        // If limit of range was previously higher we keep the higher limit
        if (op == ">")
            low = Math.max(low, limit + 1)
        // See above, keep lower maximum even if this rule would allow higher
        if (op == "<")
            high = Math.min(high, limit - 1)
        if (low > high)
            continue
        let newR = JSON.parse(JSON.stringify(oldRange))
        newR[key] = {low: low, high: high}
        n.push(newR)
    }
    // Ranges have been carved out and now only contain the values matching rule
    return n
}

function countRanges(ruleList) {
    let currentRule = ruleList[0];
    if (currentRule == "R") {
        // Accept nothing!
        return []
    }
    if (currentRule == "A") {
        let low = 1
        let high = 4000
        // If you reach this rule, all values for X M A S are accepted!
        return [{
            x: {low: low, high: high},
            m: {low: low, high: high},
            a: {low: low, high: high},
            s: {low: low, high: high}
        }]
    }
    // Unconditional jump
    if (!currentRule.includes(":"))
        return countRanges(rules[currentRule].rules)
    if (currentRule.includes("<")) {
        let {key, value, target} = parseLt(currentRule);
        let targetRules = rules[target].rules;
        // This rule matches, so include all ranges that result from jumping to target
        let matching = inspect(key, "<", value, countRanges(targetRules))
        // This rule fails, so include all ranges that result from next rule
        let nextSteps = ruleList.slice(1);
        let notmatching = inspect(key, ">", value - 1, countRanges(nextSteps))
        let ans = []
        ans.push(...matching)
        ans.push(...notmatching)
        return ans
    }
    if (currentRule.includes(">")) {
        let {key, value, target} = parseGt(currentRule);
        let targetRules = rules[target].rules;
        // This rule matches, so include all ranges that result from jumping to target
        let matching = inspect(key, ">", value, countRanges(targetRules))
        // This rule fails, so include all ranges that result from next rule
        let nextSteps = ruleList.slice(1);
        let notmatching = inspect(key, "<", value + 1, countRanges(nextSteps))
        let ans = []
        ans.push(...matching)
        ans.push(...notmatching)
        return ans
    }
}

// If there's a forced jump to accept/reject, just do the needful
rules["A"] = {rules: ["A"]}
rules["R"] = {rules: ["R"]}
let limits = countRanges(rules["in"].rules)
// Limits is now a long list of ranges
let part2 = 0
for (const limit of limits) {
    // Plus one because if high and low are the same value then we accept one part
    let valid_x = limit["x"].high - limit["x"].low + 1
    let valid_m = limit["m"].high - limit["m"].low + 1
    let valid_a = limit["a"].high - limit["a"].low + 1
    let valid_s = limit["s"].high - limit["s"].low + 1
    part2 += valid_x * valid_m * valid_a * valid_s
}
console.log("Part 2 " + part2)