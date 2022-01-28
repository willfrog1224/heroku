const path = require('path');
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://jill:mongoUser1@cluster0.ouhbd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const corsOptions = {
  origin: "https://jacse341-main.herokuapp.com/",
  optionsSuccessStatus: 200
};
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61f0c4fae27c3373eafb5fee')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URL)

  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'jill',
          email: 'jill@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


  