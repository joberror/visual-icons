let
  colorInput = document.getElementById('colorVal'),
  strokeInput = document.getElementById('str_width'),
  getStrokeOutput = document.querySelector('.output'),
  viewerId;

[colorInput, strokeInput].forEach((el) => {
  el.addEventListener('change', (event) => {
    viewerId = document.querySelector('#viewer')
      .querySelectorAll("line, rect, path, circle, polygon, ellipse, polyline");

    viewerId.forEach((item) => {
      if (event.target.id == 'colorVal') {
        item.style.stroke = event.target.value;
      }
      else {
        item.style.strokeWidth = event.target.value;
        getStrokeOutput.textContent = event.target.value;
      }
    });
  });
});
