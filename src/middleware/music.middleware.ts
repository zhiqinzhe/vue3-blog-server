import Joi from 'joi';
import { ParameterizedContext } from 'koa';

import emitError from '@/app/handler/emit-error';

const schema = Joi.object({
  id: Joi.number(),
  name: Joi.string().min(1).max(30),
  cover_pic: Joi.string().min(3).max(80),
  author: Joi.string().min(1).max(30),
  audio_url: Joi.string().min(3).max(80),
  status: [1, 2],
});

export const verifyProp = async (ctx: ParameterizedContext, next) => {
  const props = ctx.request.body;
  try {
    await schema.validateAsync(props, {
      abortEarly: false,
      allowUnknown: false,
      convert: false,
    });
    await next();
  } catch (error) {
    emitError({ ctx, code: 400, error });
  }
};
