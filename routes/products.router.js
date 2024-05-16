import express from 'express';
import Products from '../schemas/products.schemas.js';
import joiSchema from '../joi.js';

const router = express.Router();

//상품 생성 api
router.post('/products', async (req, res, next) => {
  try {
    // 리퀘스트해서 받은 상품 정보 받아오기
    const { name, description, manager, password, status } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();

    await joiSchema.createSchema.validateAsync({
      name,
      description,
      manager,
      password,
      status,
    });

    const createdProducts = await Products.create({
      name,
      description,
      manager,
      password,
      status,
      createdAt,
      updatedAt,
    });

    const { password: _, __v: a, ...resProducts } = createdProducts.toObject();

    return res
      .status(201)
      .json({ message: '상품 생성에 성공했습니다.', goods: resProducts });
  } catch (error) {
    next(error);
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
  try {
    const { productsId } = req.params;
    await joiSchema.findSchema.validateAsync({ productsId });
    const findProducts = await Products.findById(productsId)
      .select('-password')
      .exec();
    if (!findProducts) {
      return res
        .status(404)
        .json({ errorMessage: '상품이 존재하지 않습니다.', products: [] });
    }
    return res.status(200).json({
      message: '상품 상세 조회에 성공했습니다.',
      products: findProducts,
    });
  } catch (error) {
    next(error);
  }
});

//상품 삭제 api
router.delete('/products/:productsId', async (req, res, next) => {
  try {
    const { productsId } = req.params;
    const { password } = req.body;
    await joiSchema.findSchema.validateAsync({ productsId });
    const findProducts = await Products.findById(productsId).exec();

    if (!findProducts) {
      return res
        .status(404)
        .json({ errorMessage: '상품이 존재하지 않습니다.' });
    }

    await joiSchema.deleteSchema.validateAsync({ password });

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
  } catch (error) {
    next(error);
  }
});

//상품 수정 api
router.put('/products/:productsId', async (req, res, next) => {
  try {
    const { productsId } = req.params;
    const { name, description, manager, status, password } = req.body;

    await joiSchema.findSchema.validateAsync({ productsId });

    const targetProduts = await Products.findById(productsId).exec();

    if (!targetProduts) {
      return res
        .status(404)
        .json({ errorMessage: '상품이 존재하지 않습니다.' });
    }

    await joiSchema.patchSchema.validateAsync({
      name,
      description,
      manager,
      status,
      password,
    });

    if (password !== targetProduts.password) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }

    targetProduts.name = name;
    targetProduts.description = description;
    targetProduts.manager = manager;
    targetProduts.status = status;
    targetProduts.password = password;
    targetProduts.updatedAt = new Date();

    await targetProduts.save();

    const { password: _, __v: a, ...resProducts } = targetProduts.toObject();

    return res.status(200).json({
      message: '상품 수정에 성공했습니다.',
      products: resProducts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
