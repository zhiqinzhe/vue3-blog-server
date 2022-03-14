import Sequelize from 'sequelize';

import { IType } from '@/interface';
import typeModel from '@/model/type.model';
import { handlePaging } from '@/utils';

const { Op } = Sequelize;
class TypeService {
  /** 分类是否存在 */
  async isExist(type_ids: number[]) {
    const res = await typeModel.findAll({
      where: {
        id: {
          [Op.or]: type_ids,
        },
      },
    });
    return res.length === type_ids.length;
  }

  /** 获取分类列表 */
  async getList({ nowPage, pageSize, orderBy, orderName }) {
    const offset = (parseInt(nowPage, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);
    const result = await typeModel.findAndCountAll({
      order: [[orderName, orderBy]],
      limit,
      offset,
    });
    return handlePaging(nowPage, pageSize, result);
  }

  /** 查找分类 */
  async find(id: number) {
    const result = await typeModel.findOne({ where: { id } });
    return result;
  }

  /** 修改分类 */
  async update({ id, name }: IType) {
    const result = await typeModel.update({ name }, { where: { id } });
    return result;
  }

  /** 创建分类 */
  async create({ name }: IType) {
    const result = await typeModel.create({ name });
    return result;
  }

  /** 删除分类 */
  async delete(id: number) {
    const result = await typeModel.destroy({
      where: { id },
      individualHooks: true,
    });
    return result;
  }
}

export default new TypeService();