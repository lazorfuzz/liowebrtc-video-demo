function randColor() {
  return Math.floor(100 + (Math.random() * 155));
}

function hex(x) {
  return ("0" + parseInt(x, 16).toString(16)).slice(-2);
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function getRandomRGB() {
  const r = randColor();
  const g = randColor();
  const b = randColor();
  return ({ r, g, b, a: 1 });
}

module.exports = {
  getRandomRGB,
  rgb2hex
}
