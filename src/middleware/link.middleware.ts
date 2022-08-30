import Joi from 'joi';
import { ParameterizedContext } from 'koa';

const schema = Joi.object({
  id: Joi.number(),
  email: Joi.string().min(3).max(50),
  name: Joi.string().min(3).max(50),
  avatar: Joi.string().min(5).max(80),
  desc: Joi.string().min(3).max(50),
  url: Joi.string().min(5).max(80),
  status: [1, 2],
});

const verifyProp = async (ctx: ParameterizedContext, next) => {
  const props = ctx.request.body;
  await schema.validateAsync(props, {
    abortEarly: false,
    allowUnknown: false,
    convert: false,
  });
  await next();
};

export { verifyProp };
