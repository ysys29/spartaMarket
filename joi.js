import joi from 'joi';

//생성 스키마
const createSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  manager: joi.string().required(),
  password: joi.string().required(),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT').default('FOR_SALE'),
});

//수정 스키마
const patchSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  manager: joi.string().required(),
  password: joi.string().required(),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT').required(),
  productsId: joi.string().length(24),
});

//조회 스키마
const findSchema = joi.object({
  productsId: joi.string().length(24),
});

//삭제 스키마
const deleteSchema = joi.object({
  password: joi.string().required(),
  productsId: joi.string().length(24),
});

const joiSchema = {
  createSchema,
  patchSchema,
  findSchema,
  deleteSchema,
};

export default joiSchema;
