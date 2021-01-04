// Global selections and varibale
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;

// Add event listeners
sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUi(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex);
  });
});
popup.addEventListener('transitionend', () => {
  const popupBox = popup.children[0];
  popup.classList.remove('active');
  popupBox.classList.remove('active');
});

// functions

// Color Generater without chroma js
// function generateHex() {
//   const letters = '#0123456789ABCDEF';
//   let hash = '#';
//   for (let i = 0; i < 6; i++) {
//     hash += letters[Math.floor(Math.random() * 16)];
//   }
//   return hash;
// }

// with chroma js
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    // Add it ti array
    initialColors.push(chroma(randomColor).hex());

    // Add color to the backGorund
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // check for contrast
    checkTextContrast(randomColor, hexText);
    // Initial Colorize Sliders

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll('.sliders input');
    const hue = sliders[0];
    const brightness = sliders[1];
    const stauration = sliders[2];

    colorizeSliders(color, hue, brightness, stauration);
  });
  //Rest input
  restInputs();
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = '#000';
  } else {
    text.style.color = '#fff';
  }
}

function colorizeSliders(color, hue, brightness, stauration) {
  //Scale Saturation
  const noSat = color.set('hsl.s', 0);
  const fullSat = color.set('hsl.s', 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale brightness
  const midBright = color.set('hsl.l', 0.5);
  const scaleBright = chroma.scale(['black', midBright, 'white']);

  //Input update
  stauration.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )},${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)},${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute('data-bright') ||
    e.target.getAttribute('data-sat') ||
    e.target.getAttribute('data-hue');
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);

  colorDivs[index].style.backgroundColor = color;

  // Colorize sliders/input
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUi(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector('h2');
  const icons = activeDiv.querySelectorAll('.controls button');
  textHex.innerText = color.hex();
  // check contracts
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function restInputs() {
  const sliders = document.querySelectorAll('.sliders input');
  sliders.forEach((slider) => {
    if (slider.name === 'hue') {
      const hueColor = initialColors[slider.getAttribute('data-hue')];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === 'brightness') {
      const brightColor = initialColors[slider.getAttribute('data-bright')];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === 'saturation') {
      const satColor = initialColors[slider.getAttribute('data-sat')];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement('textarea');
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  //pop up
  const popupBox = popup.children[0];
  popup.classList.add('active');
}
randomColors();
