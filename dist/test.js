let arr1 = [
    'swerve/mini.svg',
    'grip/after.svg',
    'brand/back.svg'
  ],
  arr2 = [
    'after.svg',
    'back.svg',
    'mini.svg'
  ],
  arr = [];

arr2.forEach(function (a) {
  arr1.forEach(function (b, i) {
    if (b.match(a)) arr.push(arr1[i]);
  });

});

console.log(arr);