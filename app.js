const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// * initializing routes
const productRouter = require('./routes/product_route');
const orderRouter = require('./routes/order_route');
const userRouter = require('./routes/user_route');

mongoose.set('useCreateIndex', true);
mongoose.connect(
	process.env.DATABASE_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log(
      `===================={     CONNECTED TO MONGODB     }====================`
    );
  }
);

const app = express();

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// * example
app.get('/', (req, res) => {
  res.status(200).send('WELCOME HERE, NOW OPEN POSTMAN');
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error = new Error('NOT FOUND');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
