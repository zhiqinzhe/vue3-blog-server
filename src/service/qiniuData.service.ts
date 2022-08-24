import Sequelize from 'sequelize';

import { IQiniuData, IList } from '@/interface';
import qiniuDataModel from '@/model/qiniuData.model';
import { handlePaging } from '@/utils';

interface ISearch extends IQiniuData, IList {}

const { Op, cast, col } = Sequelize;
class QiniuDataService {
  /** 文件是否存在 */
  async isExist(ids: number[]) {
    const res = await qiniuDataModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return res === ids.length;
  }

  async getPrefixList(prefix) {
    const result = await qiniuDataModel.findAndCountAll({
      where: {
        prefix,
      },
    });
    return result;
  }

  /** 获取文件列表 */
  async getList({
    nowPage,
    pageSize,
    orderBy,
    orderName,
    keyWord,
    id,
    user_id,
    prefix,
  }: ISearch) {
    const offset = (parseInt(nowPage, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);
    const allWhere: any = {};
    if (id) {
      allWhere.id = id;
    }
    if (user_id) {
      allWhere.user_id = user_id;
    }
    if (prefix) {
      allWhere.prefix = prefix;
    }
    if (keyWord) {
      const keyWordWhere = [
        {
          qiniu_key: {
            [Op.like]: `%${keyWord}%`,
          },
        },
      ];
      allWhere[Op.or] = keyWordWhere;
    }
    let orderNameRes = orderName;
    if (orderNameRes === 'qiniu_fsize') {
      // @ts-ignore
      orderNameRes = cast(col(orderNameRes), 'SIGNED');
    }
    const result = await qiniuDataModel.findAndCountAll({
      order: [[orderNameRes, orderBy]],
      limit,
      offset,
      where: {
        ...allWhere,
      },
    });
    return handlePaging(nowPage, pageSize, result);
  }

  /** 查找文件 */
  async find(id: number) {
    const result = await qiniuDataModel.findOne({ where: { id } });
    return result;
  }

  /** 修改文件 */
  async update({
    id,
    user_id,
    prefix,
    bucket,
    qiniu_fsize,
    qiniu_hash,
    qiniu_key,
    qiniu_md5,
    qiniu_mimeType,
    qiniu_putTime,
    qiniu_status,
    qiniu_type,
  }: IQiniuData) {
    const result = await qiniuDataModel.update(
      {
        user_id,
        prefix,
        bucket,
        qiniu_fsize,
        qiniu_hash,
        qiniu_key,
        qiniu_md5,
        qiniu_mimeType,
        qiniu_putTime,
        qiniu_status,
        qiniu_type,
      },
      { where: { id } }
    );
    return result;
  }

  /** 创建文件 */
  async create({
    user_id,
    prefix,
    bucket,
    qiniu_fsize,
    qiniu_hash,
    qiniu_key,
    qiniu_md5,
    qiniu_mimeType,
    qiniu_putTime,
    qiniu_status,
    qiniu_type,
  }: IQiniuData) {
    const result = await qiniuDataModel.create({
      user_id,
      prefix,
      bucket,
      qiniu_fsize,
      qiniu_hash,
      qiniu_key,
      qiniu_md5,
      qiniu_mimeType,
      qiniu_putTime,
      qiniu_status,
      qiniu_type,
    });
    return result;
  }

  /** 删除文件 */
  async batchDelete(prefix: IQiniuData['prefix']) {
    const result = await qiniuDataModel.destroy({
      where: { prefix },
      individualHooks: true,
    });
    return result;
  }

  /** 删除文件 */
  async delete(id: number) {
    const result = await qiniuDataModel.destroy({
      where: { id },
      individualHooks: true,
    });
    return result;
  }
}

export default new QiniuDataService();