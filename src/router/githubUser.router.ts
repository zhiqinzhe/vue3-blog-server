import Router from 'koa-router';

import githubUserController from '@/controller/githubUser.controller';

const githubUserRouter = new Router({ prefix: '/github_user' });

// 用户列表
githubUserRouter.get('/list', githubUserController.list);

// 用户github登录
githubUserRouter.get('/login', githubUserController.login);

// 绑定github
githubUserRouter.get('/bind_user', githubUserController.bindGithub);

// 取消绑定github
githubUserRouter.get(
  '/cancel_bind_user',
  githubUserController.cancelBindGithub
);

// 查找用户
githubUserRouter.get('/find/:id', githubUserController.find);

// 更新用户
githubUserRouter.put('/update/:id', githubUserController.update);

// 删除用户
githubUserRouter.delete('/delete/:id', githubUserController.delete);

export default githubUserRouter;
