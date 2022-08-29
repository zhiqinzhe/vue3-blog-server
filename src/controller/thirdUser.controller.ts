import { ParameterizedContext } from 'koa';

import emitError from '@/app/handler/emit-error';
import successHandler from '@/app/handler/success-handle';
import { IList, IThirdUser } from '@/interface';
import thirdUserService from '@/service/thirdUser.service';

class ThirdUserController {
  async getList(ctx: ParameterizedContext, next) {
    try {
      const {
        id,
        orderBy = 'asc',
        orderName = 'id',
        nowPage,
        pageSize,
        keyWord,
      }: IList<IThirdUser> = ctx.request.query;
      const result = await thirdUserService.getList({
        nowPage,
        pageSize,
        orderBy,
        orderName,
      });
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async find(ctx: ParameterizedContext, next) {
    try {
      const id = +ctx.params.id;
      const result = await thirdUserService.find(id);
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async update(ctx: ParameterizedContext, next) {
    try {
      const id = +ctx.params.id;
      const { user_id, third_platform, third_user_id }: IThirdUser =
        ctx.request.body;
      const isExist = await thirdUserService.isExist([id]);
      if (!isExist) {
        emitError({
          ctx,
          code: 400,
          error: `不存在id为${id}的第三方用户记录!`,
        });
        return;
      }
      const result = await thirdUserService.update({
        id,
        user_id,
        third_platform,
        third_user_id,
      });
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async create(ctx: ParameterizedContext, next) {
    try {
      const { user_id, third_platform, third_user_id }: IThirdUser =
        ctx.request.body;
      const result = await thirdUserService.create({
        user_id,
        third_platform,
        third_user_id,
      });
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async delete(ctx: ParameterizedContext, next) {
    try {
      const id = +ctx.params.id;
      const isExist = await thirdUserService.isExist([id]);
      if (!isExist) {
        emitError({
          ctx,
          code: 400,
          error: `不存在id为${id}的第三方用户记录!`,
        });
        return;
      }
      const result = await thirdUserService.delete(id);
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }
}

export default new ThirdUserController();
