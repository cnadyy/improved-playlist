export default function moveTrail(
  disabled: number[][],
  oldTrail: number[],
  newTrail: number[],
) {
  const oldSubitems = disabled
    .filter((trail) => {
      return oldTrail.toString() == trail.slice(0, oldTrail.length).toString();
    })
    .map((trail) => {
      return [...newTrail, ...trail.slice(oldTrail.length)];
    });

  const filtered = disabled.filter((trail) => {
    return oldTrail.toString() != trail.slice(0, oldTrail.length).toString();
  });

  const moveBack = filtered.map((trail) => {
    if (
      oldTrail.slice(0, oldTrail.length - 1).toString() ==
        trail.slice(0, oldTrail.length - 1).toString() &&
      oldTrail[oldTrail.length - 1] <= trail[oldTrail.length - 1]
    ) {
      trail[oldTrail.length - 1] -= 1;
      return trail;
    } else {
      return trail;
    }
  });

  const moveForward = moveBack.map((trail) => {
    if (
      newTrail.slice(0, newTrail.length - 1).toString() ==
        trail.slice(0, newTrail.length - 1).toString() &&
      newTrail[newTrail.length - 1] <= trail[newTrail.length - 1]
    ) {
      trail[newTrail.length - 1] += 1;
      return trail;
    } else {
      return trail;
    }
  });

  return [...moveForward, ...oldSubitems];
}

// // FIXME: consider this example
// // Should this return [[6, 5, 6]] or [6, 4, 6]
// console.log(moveTrail([[7, 4, 6]], [3], [7, 4]));

// console.log(moveTrail([[3, 4, 6]], [3], [7]));
