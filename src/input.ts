const downKeys = new Set<string>();
let pressedKeys = new Set<string>();
let releasedKeys = new Set<string>();

document.body.addEventListener('keydown', (e) => {
  // console.log('e==', e, e.code);
  downKeys.add(e.code);
});
document.body.addEventListener('keyup', (e) => {
  downKeys.delete(e.code);
});

export function isKeyDown(code: string) {
  // console.log('isKeyDown', downKeys);
  return downKeys.has(code);
}

export function isKeyPressed(code: string) {
  // console.log('isKeyPressed', pressedKeys);
  return pressedKeys.has(code);
}

export function isKeyReleased(code: string) {
  // console.log('isKeyReleased', releasedKeys);
  return releasedKeys.has(code);
}

let prevKeys = new Set<string>();
export function updatePressedReleased() {
  const pressed = new Set<string>();
  downKeys.forEach((k) => {
    if (!prevKeys.has(k)) pressed.add(k);
  });

  const released = new Set<string>();
  prevKeys.forEach((k) => {
    if (!downKeys.has(k)) released.add(k);
  });

  pressedKeys = pressed;
  releasedKeys = released;
  // if (pressedKeys.size > 0) console.log('+', pressedKeys);
  // if (releasedKeys.size > 0) console.log('-', releasedKeys);

  prevKeys = new Set(downKeys);
}
