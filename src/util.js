export function convertToCoolObj(arr) {
  return {
    wrist: arr[0],
    thumb_0: arr[1],
    thumb_1: arr[2],
    thumb_2: arr[3],
    thumb_3: arr[4],
    index_0: arr[5],
    index_1: arr[6],
    index_2: arr[7],
    index_3: arr[8],
    middle_0: arr[9],
    middle_1: arr[10],
    middle_2: arr[11],
    middle_3: arr[12],
    ring_0: arr[13],
    ring_1: arr[14],
    ring_2: arr[15],
    ring_3: arr[16],
    pinky_0: arr[17],
    pinky_1: arr[18],
    pinky_2: arr[19],
    pinky_3: arr[20],
  };
}

const BIASES = {
  thumb: 35,
  index: 20,
  middle: 20,
  ring: 20,
  pinky: 30,
};

export function checkIfStraight(fingers, finger) {
  const BIAS = BIASES[finger];
  const arr = Array(4)
    .fill(-1)
    .map((_, i) => fingers[finger + "_" + i]);

  let old_angle = false;
  let angles = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = [arr[i], arr[i + 1]];

    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    angles.push(angle);

    if (old_angle === false) {
      old_angle = angle;
      continue;
    } else {
      if (Math.abs(angle - old_angle) > BIAS) {
        return false;
      }
    }
  }

  return true;
}

export function checkIfDrawing(fingers) {
  const { num, index } = howManyFingersUp(fingers);

  return num === 1 && index;
}

export function howManyFingersUp(fingers) {
  const thumb = checkIfStraight(fingers, "thumb");
  const index = checkIfStraight(fingers, "index");
  const middle = checkIfStraight(fingers, "middle");
  const ring = checkIfStraight(fingers, "ring");
  const pinky = checkIfStraight(fingers, "pinky");

  let fingers_up = 0;
  let res = {};
  if (thumb) {
    fingers_up++;
    res.thumb = true;
  }
  if (index) {
    fingers_up++;
    res.index = true;
  }
  if (middle) {
    fingers_up++;
    res.middle = true;
  }
  if (ring) {
    fingers_up++;
    res.ring = true;
  }
  if (pinky) {
    fingers_up++;
    res.pinky = true;
  }

  return { num: fingers_up, ...res };
}
