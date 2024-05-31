export function init(video, ctx, cb) {
  const hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });
  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((res) => draw(res, ctx, cb));

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: window.innerWidth,
    height: window.innerHeight,
  });
  camera.start();
}

function draw(results, ctx, cb) {
  cb(results);

  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
    }
  }
  ctx.restore();
}
