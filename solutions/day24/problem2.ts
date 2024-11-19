// input format: px py pz @ vx vy vz

type Position = { x: number, y: number, z: number }
type Hail = {
  // pos: Position,
  vel: Position,
  frames: Position[],
  id: number,
  // m: number,
  // b: number,
}

// function getIntersection(a: Hail, b: Hail) {
//   if (a.m === b.m) return
//   const x = (b.b - a.b) / (a.m - b.m)
//   const y = a.m * x + a.b
//   return { x, y }
// }

// function printHail(hail: Hail) {
//   return `${hail.pos.x}, ${hail.pos.y}, ${hail.pos.z} @ ${hail.vel.x}, ${hail.vel.y}, ${hail.vel.z}`
// }

// const isInPast: ((hail: Hail, int: { x: number, y: number }) => boolean)[] = [
//   (hail, int) => hail.vel.x < 0 && int.x > hail.pos.x,
//   (hail, int) => hail.vel.x > 0 && int.x < hail.pos.x,
//   (hail, int) => hail.vel.y < 0 && int.y > hail.pos.y,
//   (hail, int) => hail.vel.y > 0 && int.y < hail.pos.y,
// ]
// 
// function withinBoundsInc(min: number, val: number, max: number) {
//   return min <= val && val <= max
// }
// 
// function testPast(hail: Hail, int: { x: number, y: number }) {
//   return isInPast.some(func => func(hail, int))
// }

// const config = { fileName: 'inputs.txt', min: 200000000000000, max: 400000000000000 }
const config = { fileName: 'example.txt', min: 7, max: 27 }

const fileContents = await Bun.file(config.fileName).text()

const hailStones = fileContents
.split(/\n/)
.filter(line => line)
.map<Hail>((line, i) => {
  const match = line.match(/(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)/)!
  const [ _, px, py, pz, vx, vy, vz ] = match.map(num => Number(num))
  // const m = vy / vx
  // const b = py - m * px
  return {
    // pos: { x: px, y: py, z: pz },
    vel: { x: vx, y: vy, z: vz },
    // m,
    // b,
    frames: [
      { x: px, y: py, z: pz }
    ],
    id: i,
  }
})
// PART 1
// .reduce((total1, hail1, i, arr) => {
//   return total1 + arr.slice(i).reduce((total2, hail2) => {
//     const int = getIntersection(hail1, hail2);
//     if (int) {
//       const { x, y } = int;
//       if (withinBoundsInc(config.min, x, config.max) && withinBoundsInc(config.min, y, config.max)) {
//         if (!testPast(hail1, int) && !testPast(hail2, int)) {
//           return total2 + 1
//         }
//       }
//     }
//     return total2
//   }, 0)
// }, 0)
// console.log(answer, answer === 16172)

// type Diff = { x: number, y: number, z: number }
// function getDiff(a: Hail, b: Hail): Diff {
//   return {
//     x: a.vel.x - b.vel.x,
//     y: a.vel.y - b.vel.y,
//     z: a.vel.z - b.vel.z,
//   }
// }

// function getAllPositions(stones: Hail[]) {
//   const trajectories: Diff[][]  = []
//   stones.forEach((hail1, i) => {
//     trajectories.push(
//       stones.map(hail2 => hail1 !== hail2 ? getDiff(hail1, hail2) : undefined).filter(diff => diff !== undefined) as Diff[]
//     )
//   })
//   console.log(trajectories)
// }
// // getAllPositions(hailStones)
// 
// function findLine(diffs: Diff[][]) {
//   return diffs.find(hailDiffs => {
//     hailDiffs.find(diff => {
//       const strDiff = JSON.stringify(diff)
//     })
//   })
// }

function setNextFrame(stones: Hail[]) {
  console.log('CREATED NEXT FRAME', stones[0].frames.length)
  stones.forEach(hail => {
    hail.frames.push({
      x: hail.frames[hail.frames.length - 1].x + hail.vel.x,
      y: hail.frames[hail.frames.length - 1].y + hail.vel.y,
      z: hail.frames[hail.frames.length - 1].z + hail.vel.z,
    })
  })
}
// console.log(JSON.stringify(hailStones, undefined, 2))
// setNextFrame(hailStones)
// console.log(JSON.stringify(hailStones, undefined, 2))

// function getDiff(a: Position, b: Position) {
function getDiff(a: Position, b: Position, step = 1) {
  // console.log('diffing', a, b)
  return {
    x: (b.x - a.x) / step,
    y: (b.y - a.y) / step,
    z: (b.z - a.z) / step,
  }
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

function stoneIsOutOfBounds(pos: Position) {
  const max = getMax(hailStones);
  if (pos.x >= max.x) return true;
  if (pos.y >= max.y) return true;
  if (pos.z >= max.z) return true;
  if (pos.x < 0) return true;
  if (pos.y < 0) return true;
  if (pos.z < 0) return true;
}

function hasLine(time = 2, used: number[], diff: Position, prevPos: Position): boolean {
  // This is where do the dfsing
  // console.log(used)
  if (used.length === hailStones.length) return true
  if (stoneIsOutOfBounds(prevPos)) return false
  if (time + 1 >= hailStones[0].frames.length) {
    // console.log('no more frames') 
    return false
  }
  return hailStones.filter(stone => !used.includes(stone.id)).some(stone => {
    const newDiff = getDiff(prevPos, stone.frames[time + 1])
    if (JSON.stringify(newDiff) === JSON.stringify(diff)) {
      return hasLine(time + 1, used.concat(stone.id), diff, stone.frames[time + 1])
    } else {
    }
  }) || hasLine(time + 1, used, diff, {
      x: prevPos.x + diff.x,
      y: prevPos.y + diff.y,
      z: prevPos.z + diff.z,
    })
  
  return true || undefined
}

function getMax(hailStones: Hail[]) {
  return hailStones.reduce((max, hail) => {
    hail.frames.forEach(frame => {
      if (frame.x > max.x) max.x = frame.x
      if (frame.y > max.y) max.y = frame.y
      if (frame.z > max.z) max.z = frame.z
    })
    return max
  }, { x: 0, y: 0, z: 0 })
}

// This is all the frames we need to solve the example
for (let i = 0; i < 6; i++) {
  setNextFrame(hailStones)
}

// function tracePath(hail1: Hail, time = 1, diff?: Position, prevPos?: Position) {
//   const availableStones = hailStones.filter(stone => stone.id !== hail1.id);
//   availableStones.forEach(hail2 => {
//     if (!diff || !prevPos) {
//       diff = getDiff(hail1.frames[time], hail2.frames[time + 1])
//       return tracePath(hail2, time + 1, diff, hail2.frames[time + 1])
//     } else {
//       const newPos = {
//         x: prevPos.x + diff.x,
//         y: prevPos.y + diff.y,
//         z: prevPos.z + diff.z,
//       }
//       availableStones.filter(stone => JSON.stringify(stone.frames[time + 1]) === JSON.stringify(newPos))
//     }
//   })
// }

function tracePath(time: number, used: number[], prevPos: Position, diff: Position) {
  const newPos = {
    x: prevPos.x + diff.x,
    y: prevPos.y + diff.y,
    z: prevPos.z + diff.z,
  }
  // console.log('checking pos', newPos, diff, prevPos)
  // console.log('prevPos', JSON.stringify(prevPos))
  // console.log('diff', JSON.stringify(diff))
  // console.log('checking pos', JSON.stringify(newPos))
  // console.log(time, used)
  if (used.length === hailStones.length) {
    console.log('YEEEEEEEEEEEEEEEHAW')
    winner = true
    console.log(hailStones[used[0]].frames[1], diff)
    return true
  }
  if (stoneIsOutOfBounds(newPos)) {
    // console.log('OUT OF BOUNDS')
    return false
  }

  const nextStone = hailStones.filter(stone => !used.includes(stone.id)).find(stone => {
    return JSON.stringify(stone.frames[time + 1]) === JSON.stringify(newPos)
  })

  if (nextStone) {
    console.log('found next stone')
    return tracePath(time + 1, used.concat(nextStone.id), newPos, diff)
  } else {
    return tracePath(time + 1, used, newPos, diff)
  }

  // hailStones.filter(stone => !used.includes(stone.id)).map(stone => {
  //   if (JSON.stringify(stone.frames[time + 1]) === JSON.stringify(newPos)) {
  //     return tracePath(time + 1, used.concat(stone.id), newPos, diff)
  //   } else {
  //   }
  // })
  // if (!found) {
  //   return tracePath(time + 1, used, newPos, diff)
  // }
}

// How do we exit this nested cluster as soon as we have a result?
// Generate extra frames until we find our answer
// Find ways to eliminate bad trajectories early
//  - idk maybe consider memoization
let winner = false;
let result;
const availableFrames = [ ...Array(hailStones[0].frames.length - 1).keys() ].map(i => i + 1)
hailStones.forEach(hail1 => {
  hailStones.filter(hail2 => hail2.id !== hail1.id).forEach(hail2 => {
    availableFrames.forEach((time1, i) => {
      availableFrames.slice(i + 1).forEach(time2 => {
        // console.log(
        //   'at root',
        //   'time1', time1,
        //   'time2', time2,
        //   'stone1', hail1.id,
        //   'stone2', hail2.id,
        // )
        const diff = getDiff(hail1.frames[time1], hail2.frames[time2], time2 - time1)
        const answer = tracePath(time2, [ hail1.id, hail2.id ], hail2.frames[time2], diff)
        if (answer) {
          result = Object.keys(hail1.frames[time1]).reduce((total, coor) => {
            // @ts-ignore
            console.log(coor, hail1.frames[time1][coor] - (diff[coor] * time1))
            // @ts-ignore
            return total + hail1.frames[time1][coor] - (diff[coor] * time1)
          }, 0)
        }
      })
    })
  })
  console.log('checked stone', hail1.id)
})

// tracePath(3, [ 4, 1 ], hailStones[1].frames[3], getDiff(hailStones[4].frames[1], hailStones[1].frames[3], 2))
console.log('winner', winner)
console.log(result)

// let firstStone;
// let secondStone;
// hailStones.forEach(() => setNextFrame(hailStones))
// while (true) {
//   // There are many problems with this approach
//   // we are checking between frame 1 and frame 2, but what if frame 1 is right but we need frame 3 or more to continue the line, we'll never check that
//   const frameOpts = [ ...Array(hailStones[0].frames.length - 1).keys() ].map(i => i + 1)
//   const result = hailStones.find(hail1 => {
//     return hailStones.filter(stone => stone.id !== hail1.id).find(hail2 => {
//       frameOpts.find((time1, i) => {
//         frameOpts.slice(i + 1).find(time2 => {
//           const isLine = hasLine(time2, [ hail1.id, hail2.id ], getDiff(hail1.frames[time1], hail2.frames[time2]), hail2.frames[time2])
//           if (isLine) {
//             console.log('ANSWER')
//             firstStone = hail1
//             secondStone = hail2
//             return true
//           }
//         })
//       })
//     })
//   })
//   if (result) {
//     break;
//   } else {
//     console.log('MAKE MORE FRAMES')
//     setNextFrame(hailStones)
//   }
// }
// console.log(firstStone, secondStone)

// function start() {
//   hailStones.forEach(() => setNextFrame(hailStones))
//   while (true) {
//     const line = hasLine(hailStones)
//     if (line) {
//       return line
//     }
//     setNextFrame(hailStones)
//     // break;
//   }
// }

// Here's the plan:
// First, generate our base data, if we have 6 stones, we need to generate at least t=6 worth of data
//  - This is based off the assumption that we CANNOT hit two stones at the same time
// Check of there is any combination of hail stones that makes a straight line
//  - We can just dfs from each stone until path is impossible
//    - if we have 6 stones, and 7 frames, we need to check starting from frame 0 and frame 1, but not frame 2
//      - Do we really need to check frame 0? That doesn't really make a lot of sense
//      - That would mean we are intersecting and throwing at the same time...
//    - use id numbers to avoid checking the same hail stone twice
//  - To check for line, we need to see if the same diff can get us through all points
//  - Keep in mind there can be empty spots between hail stones, i.e. one intersection at t=1 and another at t=3 is still valid
// If no line can be formed, increment time and add new node for the next 'frame', check for line again
// Once we have found line, we need a few things
//  - The diff (we can figure that out from two points if need be)
//  - A point and the time it gets intersected at
//  - Using this information we can find the position at t=0
//  - once we have position, add up x + y + z, this is the final answer
// It is worth noting that the stone MUST be thrown at t=0
//
// Questions:
// Can we have multiple intersections at the same time?
//  - The example indicates no, and logic also tells us that two things cant be in the same place at the same time
//  - The problem also indicates that no two stones will ever be in the same place at the same time, once we account for the z-axis
// Can intersections happen between time intervals? (i.e. two stones interest at t=1=5)
//  - Example also indicates no

// ANSWER PART 1: 16172
