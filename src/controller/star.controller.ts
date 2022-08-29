import { ParameterizedContext } from 'koa';

import { authJwt } from '@/app/auth/authJwt';
import emitError from '@/app/handler/emit-error';
import successHandler from '@/app/handler/success-handle';
import { IList, IStar } from '@/interface';
import articleService from '@/service/article.service';
import commentService from '@/service/comment.service';
import starService from '@/service/star.service';
import userService from '@/service/user.service';

class StarController {
  async getList(ctx: ParameterizedContext, next) {
    try {
      const {
        id,
        orderBy = 'asc',
        orderName = 'id',
        nowPage,
        pageSize,
        keyWord,
      }: IList<IStar> = ctx.request.query;
      const result = await starService.getList({
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
      const result = await starService.find(id);
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async update(ctx: ParameterizedContext, next) {
    try {
      const id = +ctx.params.id;
      const { article_id, to_user_id, from_user_id, comment_id }: IStar =
        ctx.request.body;
      const isExist = await starService.isExist([id]);
      if (!isExist) {
        emitError({ ctx, code: 400, error: `不存在id为${id}的star!` });
        return;
      }
      await starService.update({
        id,
        article_id,
        to_user_id,
        from_user_id,
        comment_id,
      });
      successHandler({ ctx });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  // DONE
  async create(ctx: ParameterizedContext, next) {
    try {
      const { article_id, to_user_id, comment_id }: IStar = ctx.request.body;
      const { code, userInfo, message } = await authJwt(ctx);
      if (code !== 200) {
        emitError({ ctx, code, error: message });
        return;
      }
      const isEverStar = await starService.everStar({
        article_id,
        comment_id,
        to_user_id,
        from_user_id: userInfo.id,
      });
      if (isEverStar) {
        throw new Error(`不能重复点赞哦!`);
      }
      const articleIsExist =
        article_id === -1 ? true : await articleService.isExist([article_id]);
      if (!articleIsExist) {
        throw new Error(`不存在id为${article_id}的文章!`);
      }
      const commentIsExist =
        comment_id === -1 ? true : await commentService.isExist([comment_id]);
      if (!commentIsExist) {
        throw new Error(`不存在id为${comment_id}的评论!`);
      }
      const userIsExist =
        to_user_id === -1 ? true : await userService.isExist([to_user_id]);
      if (!userIsExist) {
        throw new Error(`不存在id为${to_user_id}的用户!`);
      }
      await starService.create({
        article_id,
        from_user_id: userInfo.id,
        to_user_id,
        comment_id,
      });
      successHandler({ ctx });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async starForArticle(ctx: ParameterizedContext, next) {
    try {
      const { article_id, to_user_id, comment_id }: IStar = ctx.request.body;
      const { code, userInfo, message } = await authJwt(ctx);
      if (code !== 200) {
        emitError({ ctx, code, error: message });
        return;
      }
      let from_user_id = -1;
      if (code === 200) {
        from_user_id = userInfo.id;
      }
      const articleIsExist = await articleService.isExist([article_id]);
      if (!articleIsExist) {
        throw new Error(`不存在id为${article_id}的文章!`);
      }
      const commentIsExist =
        comment_id === -1 ? true : await commentService.isExist([comment_id]);
      if (!commentIsExist) {
        throw new Error(`不存在id为${comment_id}的评论!`);
      }
      const userIsExist =
        to_user_id === -1 ? true : await userService.isExist([to_user_id]);
      if (!userIsExist) {
        throw new Error(`不存在id为${from_user_id}的用户!`);
      }
      const result = await starService.create({
        article_id,
        from_user_id,
        to_user_id,
        comment_id,
      });
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  async starForUser(ctx: ParameterizedContext, next) {
    try {
      const {
        article_id = -1,
        to_user_id = -1,
        comment_id = -1,
      }: IStar = ctx.request.body;
      const { code, userInfo, message } = await authJwt(ctx);
      if (code !== 200) {
        emitError({ ctx, code, error: message });
        return;
      }
      const from_user_id = userInfo.id;
      const articleIsExist =
        article_id === -1 ? true : await articleService.isExist([article_id]);
      if (!articleIsExist) {
        throw new Error(`不存在id为${article_id}的文章!`);
      }
      const commentIsExist =
        comment_id === -1 ? true : await commentService.isExist([comment_id]);
      if (!commentIsExist) {
        throw new Error(`不存在id为${comment_id}的评论!`);
      }
      const userIsExist = await userService.isExist([
        ...new Set([to_user_id].filter((v) => v !== -1)),
      ]);
      if (!userIsExist) {
        throw new Error(`不存在id为${to_user_id}的用户!`);
      }
      const result = await starService.create({
        article_id,
        to_user_id,
        from_user_id,
        comment_id,
      });
      successHandler({ ctx, data: result });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }

  // DONE
  async delete(ctx: ParameterizedContext, next) {
    try {
      const id = +ctx.params.id;
      const isExist = await starService.isExist([id]);
      if (!isExist) {
        throw new Error(`不存在id为${id}的star!`);
      }
      const { code, userInfo, message } = await authJwt(ctx);
      if (code !== 200) {
        emitError({ ctx, code, error: message });
        return;
      }
      const isMeStar: any = await starService.find(id);
      if (isMeStar.from_user_id !== userInfo.id) {
        throw new Error(`不能删除别人的star哦!`);
      }
      await starService.delete(id);
      successHandler({ ctx });
    } catch (error) {
      emitError({ ctx, code: 400, error });
    }
    await next();
  }
}

export default new StarController();
