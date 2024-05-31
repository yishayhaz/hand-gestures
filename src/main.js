import * as camera from "./camera.js";
import * as cnvs from "./canvas";
import { convertToCoolObj, howManyFingersUp } from "./util.js";
import { trainClick, evaluateClick } from "./ai.js";
import { doIf } from "./events.js";

const number_of_fingers_html = document.querySelector("h2.top.left");
const emoji_html = document.querySelector("h2.top.right");
const drag = document.querySelector(".drag");

const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isOkeying = false;
let isDragging = false;

cnvs.init(canvas, ctx);

function cb(results) {
  doIf("print", () => {
    console.log(evaluateClick(results.multiHandLandmarks));
  });

  doIf(["click", "notAClick"], (b) => {
    trainClick(results.multiHandLandmarks, b[0]);
  });

  doIf("evaluate", () => {
    evaluate(results.multiHandLandmarks);
  });

  doIf(["thumsUp", "thumbsDown", "notAThumb"], (e) => {
    TrainThums(results.multiHandLandmarks, ...e);
  });

  if (results.multiHandLandmarks.length) {
    const lasOkeying = isOkeying;
    isOkeying = false;
    let x;
    let y;
    let sumX;
    let sumY;
    // 4, 8
    for (const hand of results.multiHandLandmarks) {
      const thumb = hand[4];
      const index = hand[8];

      x = Math.abs(thumb.x - index.x);
      y = Math.abs(thumb.y - index.y);
      sumX = (thumb.x + index.x) / 2;
      sumY = (thumb.y + index.y) / 2;

      isOkeying = x < 0.075 && y < 0.075;

      if (isOkeying) break;
    }

    if (!isOkeying) isDragging = false;

    const halfWidth = drag.clientWidth / 2;
    const halfHeight = drag.clientHeight / 2;

    const top = sumY * window.innerHeight - halfHeight;
    const left = window.innerWidth - halfWidth - sumX * window.innerWidth;

    if (!lasOkeying && !isDragging && isOkeying) {
      const rect = drag.getBoundingClientRect();
      const leftWithThreshold = rect.left - 20;
      const rightWithThreshold = rect.right + 20;
      const topWithThreshold = rect.top - 20;
      const bottomWithThreshold = rect.bottom + 20;

      const isWithin =
        left >= leftWithThreshold &&
        left <= rightWithThreshold &&
        top >= topWithThreshold &&
        top <= bottomWithThreshold;

      isDragging = isWithin;
    }

    if (isDragging) {
      drag.style.top = `${top}px`;
      drag.style.left = `${left}px`;
    }

    if (isOkeying) {
      emoji_html.innerHTML = "👌";
    } else {
      emoji_html.innerHTML = "🖐️";
    }
  }

  if (results.multiHandLandmarks.length) {
    let fingers_up = 0;
    results.multiHandLandmarks.forEach((hand) => {
      const fingers = convertToCoolObj(hand);
      const { num } = howManyFingersUp(fingers);
      fingers_up += num;
    });

    number_of_fingers_html.innerHTML = "" + fingers_up;

    // emoji_html.innerHTML = evaluate(results.multiHandLandmarks)[0];
  } else {
    number_of_fingers_html.innerHTML = "0";
    emoji_html.innerHTML = "";
  }
}

camera.init(video, ctx, cb);
