import express from 'express';
import Products from '../schemas/products.schemas.js';

const router = express.Router();

//상품 생성 api
router.post('/products', async (req, res, next) => {
  try {
    // 리퀘스트해서 받은 상품 정보 받아오기
    const { name, description, manager, password } = req.body;
    const status = 'FOR_SALE';
    const createdAt = new Date();
    const updatedAt = new Date();

    if (!name || !description || !manager || !password) {
      return res
        .status(400)
        .json({ errorMessage: '상품 정보를 모두 입력해 주세요' });
    }

    const createdProducts = await Products.create({
      name,
      description,
      manager,
      password,
      status,
      createdAt,
      updatedAt,
    });

    const { password: _, ...resProducts } = createdProducts.toObject();

    return res
      .status(201)
      .json({ message: '상품 생성에 성공했습니다.', goods: resProducts });
  } catch (error) {
    return res.status(400).json({ errorMessage: '이미 등록된 상품입니다.' });
  }
});

//상품 목록 조회 api
router.get('/products', async (req, res, next) => {
  const productsItem = await Products.find()
    .sort('-createdAt')
    .select('-password')
    .exec();

  return res
    .status(200)
    .json({ message: '상품 목록 조회에 성공했습니다.', productsItem });
});

//상품 목록 상세 조회 api
router.get('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  if (productsId.length !== 24) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  const findProducts = await Products.findById(productsId)
    .select('-password')
    .exec();
  if (!findProducts) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  return res.status(200).json({
    message: '상품 상세 조회에 성공했습니다.',
    products: findProducts,
  });
});

//상품 삭제 api
router.delete('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const { password } = req.body;
  if (productsId.length !== 24) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  const findProducts = await Products.findById(productsId).exec();

  if (!findProducts) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }

  if (!password) {
    return res.status(400).json({ errorMessage: '비밀번호를 입력해 주세요.' });
  }
  if (password !== findProducts.password) {
    return res
      .status(401)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
  }

  await Products.deleteOne({ _id: productsId });
  return res.status(200).json({
    message: '상품 삭제에 성공했습니다',
    id: productsId,
  });
});

//상품 수정 api
router.put('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const { name, description, manager, status, password } = req.body;
  if (productsId.length !== 24) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  const targetProduts = await Products.findById(productsId).exec();

  if (!targetProduts) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }

  if (!name || !description || !manager || !status || !password) {
    return res
      .status(400)
      .json({ errorMessage: '상품 정보를 모두 입력해 주세요' });
  }

  if (password !== targetProduts.password) {
    return res
      .status(401)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
  }

  if (status !== 'FOR_SALE' && status !== 'SOLD_OUT') {
    return res.status(400).json({
      errorMessage: '판매 상태는 FOR_SALE과 SOLD_OUT만 입력 가능합니다.',
    });
  }

  targetProduts.name = name;
  targetProduts.description = description;
  targetProduts.manager = manager;
  targetProduts.status = status;
  targetProduts.password = password;
  targetProduts.updatedAt = new Date();

  await targetProduts.save();

  const { password: _, ...resProducts } = targetProduts.toObject();

  return res.status(200).json({
    message: '상품 수정에 성공했습니다.',
    products: resProducts,
  });
});

export default router;
