import {Particle} from './particle.js';
let imageDom = new Image();
imageDom.src = './100w-100h-SlackImage.webp';

const canvasDom = document.querySelector('.workspace');
const canvasDomContext = canvasDom.getContext('2d');
canvasDom.width = window.innerWidth;
canvasDom.height = window.innerHeight;
let particleArray = [];

let mousePositionInfo = {
  x: null,
  y: null,
  radius: 80,
};

window.addEventListener('mousemove', (event) => {
  mousePositionInfo.x = event.x + canvasDom.clientLeft / 2;
  mousePositionInfo.y = event.y + canvasDom.clientTop / 2;
});

function initialize(imageDataInfo) {
  particleArray = [];
  return new Promise((resolve) => {
    for (let y = 0, y2 = imageDataInfo.height; y < y2; y++) {
      for (let x = 0, x2 = imageDataInfo.width; x < x2; x++) {
        // dataはUint8ClampedArray
        // サイズはcanvasの width * height * 4(r,g,b,a)
        // 先頭から、一番左上のピクセルのr,g,b,aの値が順に入っており、
        // 右隣のピクセルのr,g,b,aの値が続く
        // n から n+4 までが1つのピクセルの情報となる
        if (imageDataInfo.data[y * 4 * imageDataInfo.width + x * 4 + 3] > 128) {
          // アルファ値の大きさが128より大きい場合 半透明（アルファ値128）の画素より大きい場合なので、すこし色がくっきり見えるものを処理
          // https://talavax.com/alphavalue.html
          let positionX = x;
          let positionY = y;
          let color =
            'rgb(' +
            imageDataInfo.data[y * 4 * imageDataInfo.width + x * 4] +
            ',' +
            imageDataInfo.data[y * 4 * imageDataInfo.width + x * 4 + 1] +
            ',' +
            imageDataInfo.data[y * 4 * imageDataInfo.width + x * 4 + 2] +
            ')';

          particleArray.push(
            new Particle(imageDom, canvasDom, positionX * 4, positionY * 4, color, 2)
          );
        }
      }
    }
    // console.log(particleArray.slice(0,3))
    resolve(particleArray);
  });
}

async function drawImage() {
  let imageWidth = imageDom.width || imageDom.naturalWidth;
  let imageHeight = imageDom.height || imageDom.naturalHeight;
  const imageDataInfo = canvasDomContext.getImageData(0, 0, imageWidth, imageHeight);
  canvasDomContext.clearRect(0, 0, canvasDom.width, canvasDom.height);
  await initialize(imageDataInfo);

  window.addEventListener('resize', async (event) => {
    canvasDom.width = window.innerWidth;
    canvasDom.height = window.innerHeight;
    await initialize(imageDataInfo);
  });
}

function niceRolling(canvasDomContext, mousePositionInfo, particleArray) {
  let count = 0;
  let moveX = 0;
  function marquee(canvasDomContext, mousePositionInfo, particleArray) {
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    function reset(canvasDomContext) {
      canvasDomContext.fillStyle = 'rgba(255, 255, 255, 0.2)';
      canvasDomContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    function niceUpdate(mousePositionInfo, particleArray) {
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update(mousePositionInfo);
      }
    }
    let a = new Date();
    moveX++;
    requestAnimationFrame(() => {
      marquee(canvasDomContext, mousePositionInfo, particleArray);
    });
    if (mod(moveX, 2) + 1 === 2) {
      reset(canvasDomContext);
      niceUpdate(mousePositionInfo, particleArray);
    }
  }
  marquee(canvasDomContext, mousePositionInfo, particleArray);
}

window.addEventListener('load', (event) => {
  canvasDomContext.drawImage(imageDom, 0, 0, imageDom.width, imageDom.height);
  drawImage();
  niceRolling(canvasDomContext, mousePositionInfo, particleArray);
});
