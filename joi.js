import joi from 'joi';

//생성 스키마
const createSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  manager: joi.string().required(),
  password: joi.string().required(),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT'),
});

//수정 스키마
const patchSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  manager: joi.string().required(),
  password: joi.string().required(),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT').required(),
});

//조회 스키마
const findSchema = joi.object({
  productsId: joi.string().length(24),
});

//삭제 스키마
const deleteSchema = joi.object({
  password: joi.string().required(),
});

const joiSchema = {
  createSchema,
  patchSchema,
  findSchema,
  deleteSchema,
};

export default joiSchema;
