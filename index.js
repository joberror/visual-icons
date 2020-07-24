const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Server listening on 3000');
});

// New code
app.set('view engine', 'pug');
app.set("views", "views");
app.use(express.static("public"));