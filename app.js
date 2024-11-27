// File: image_converter.js

// Image upload and rendering
const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultCanvas = document.getElementById('resultCanvas');
const resultCtx = resultCanvas.getContext('2d');
const actions = document.getElementById('actions');
const result = document.getElementById('result');
const originalImage = document.getElementById('originalImage');
const grayscaleButton = document.getElementById('grayscale');
const blurButton = document.getElementById('blur');

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      resultCanvas.width = img.width;
      resultCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage.src = img.src;
      actions.style.display = 'block';
    };
    img.src = URL.createObjectURL(file);
  }
});

// Grayscale function
grayscaleButton.addEventListener('click', () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
  }

  resultCtx.putImageData(imageData, 0, 0);
  result.style.display = 'block';
});

// Blur function
blurButton.addEventListener('click', () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const getPixel = (x, y) => {
    const idx = (y * width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const setPixel = (x, y, rgba) => {
    const idx = (y * width + x) * 4;
    data[idx] = rgba[0];
    data[idx + 1] = rgba[1];
    data[idx + 2] = rgba[2];
    data[idx + 3] = rgba[3];
  };

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      const neighbors = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
      ];

      neighbors.forEach(([dx, dy]) => {
        const [nr, ng, nb, na] = getPixel(x + dx, y + dy);
        r += nr;
        g += ng;
        b += nb;
        a += na;
      });

      const count = neighbors.length;
      setPixel(x, y, [r / count, g / count, b / count, a / count]);
    }
  }

  resultCtx.putImageData(imageData, 0, 0);
  result.style.display = 'block';
});