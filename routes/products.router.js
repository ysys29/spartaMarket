import express from 'express';
import Products from '../schemas/products.schemas.js';

const router = express.Router();

//상품 생성 api
router.post('/products', async (req, res, next) => {
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

  return res.status(201).json({ goods: createdProducts });
});

//상품 목록 조회 api
router.get('/products', async (req, res, next) => {
  const productsItem = await Products.find().sort('-createdAt').exec();

  return res.status(200).json({ productsItem });
});

//상품 목록 상세 조회 api
router.get('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const findProducts = await Products.findById(productsId).exec();
  return res.status(200).json({ products: findProducts });
});

//상품 삭제 api
router.delete('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const findProducts = await Products.findById(productsId).exec();
  const pasteProucts = findProducts;
  await Products.deleteOne({ _id: productsId });
  return res.status(200).json({
    message: '상품 삭제에 성공했습니다',
    products: pasteProucts,
  });
});

//상품 수정 api
router.put('/products/:productsId', async (req, res, next) => {
  const { productsId } = req.params;
  const { name, description, manager, status, password } = req.body;
  const targetProduts = await Products.findById(productsId).exec();
  targetProduts.name = name;
  targetProduts.description = description;
  targetProduts.manager = manager;
  targetProduts.status = status;
  targetProduts.password = password;
  targetProduts.updatedAt = new Date();

  await targetProduts.save();

  return res.status(200).json({
    message: '상품 수정에 성공했습니다.',
    products: targetProduts,
  });
});

export default router;
