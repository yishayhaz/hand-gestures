const menu = {
  p: "print",
  e: "evaluate",
  ArrowUp: "thumsUp",
  ArrowDown: "thumbsDown",
  ArrowRight: "notAThumb",
  l: "click",
  k: "notAClick",
};

document.addEventListener("keydown", (e) => {
  if (menu[e.key]) {
    menu[menu[e.key]] = true;
  }
});

const doIf = (key, func) => {
  if (Array.isArray(key)) {
    key.forEach((k, i) => {
      if (menu[k]) {
        const arr = Array(key.length).fill(false);
        arr[i] = true;
        func(arr); // arr = [true, false, false], etc..
        menu[k] = false;
      }
    });
    return;
  }
  if (menu[key]) {
    func(true);
    menu[key] = false;
  }
};

class Events {
  events = {};
  constructor() {
    document.addEventListener("keydown", (e) => {
      if (menu[e.key]) {
        menu[menu[e.key]] = true;
      }
    });
  }

  subscribe(event, cb) {
    if (!this.events[event]) {
      this.events[event] = [cb];
    }
    this.events[event].push(cb);
  }

  fire(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((cb) => cb(...args));
  }
}

export { doIf };
export default new Events();
