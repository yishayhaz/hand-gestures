import * as brain from "brain.js";
// import data from "./data_click.json";

const net = new brain.NeuralNetwork();
// net.train(data.data);

export function TrainThums(results, isUp, isDown, isThumb) {
  results = prettify(results);

  data.data.push({
    input: results,
    output: [isUp ? 1 : isDown ? 0 : isThumb ? 0.5 : 0.5],
  });

  console.log(data);
}

export function evaluate(results) {
  results = prettify(results);
  const output = net.run(results);

  output[0] = Math.round(output[0] * 2) / 2;
  const thumbs = ["👎", "", "👍"];

  return [thumbs[output[0] * 2], output[0]];
}

const data = [];
export function trainClick(results, isClick) {
  if (!results) return;
  results = prettify(results);

  data.push({
    input: results,
    output: [+isClick],
  });

  console.log(data);
}

export function evaluateClick(results) {
  results = prettify(results);
  const output = net.run(results);

  return output[0];
}

export function prettify(results) {
  return results[0].flatMap((hand) => [hand.x, hand.y]);
}
