import express from 'express';
import connect from './schemas/index.js';
import productsRouter from './routes/products.router.js';

const app = express();
const PORT = 3000;

connect();

//바디파서
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.get('/', (req, res) => {
  return res.json({ message: '안녕!' });
});

app.use('/api', productsRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
