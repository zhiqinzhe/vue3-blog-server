import Sequelize from 'sequelize';

import { ILog } from '@/interface';
import logModel from '@/model/log.model';

const { Op } = Sequelize;

class LogService {
  /** 日志是否存在 */
  async isExist(log_ids: number[]) {
    const res = await logModel.findAll({
      where: {
        id: {
          [Op.or]: log_ids,
        },
      },
    });
    return res.length === log_ids.length;
  }

  /** 获取日志列表 */
  async getList(props) {
    const res = await logModel.findAndCountAll(props);
    return res;
  }

  /** 查找日志 */
  async find(id: number) {
    const result = await logModel.findOne({ where: { id } });
    return result;
  }

  /** 修改日志 */
  async update({
    id,
    user_id,
    api_user_agent,
    api_from,
    api_ip,
    api_hostname,
    api_method,
    api_path,
    api_query,
    api_body,
    api_err_msg,
    api_err_stack,
  }: ILog) {
    const result = await logModel.update(
      {
        user_id,
        api_user_agent,
        api_from,
        api_ip,
        api_hostname,
        api_method,
        api_path,
        api_query,
        api_body,
        api_err_msg,
        api_err_stack,
      },
      { where: { id } }
    );
    return result;
  }

  /** 创建日志 */
  async create({
    user_id,
    api_user_agent,
    api_sql_duration,
    api_from,
    api_ip,
    api_hostname,
    api_method,
    api_path,
    api_query,
    api_body,
    api_err_msg,
    api_err_stack,
  }: ILog) {
    const result = await logModel.create({
      user_id,
      api_user_agent,
      api_sql_duration,
      api_from,
      api_ip,
      api_hostname,
      api_method,
      api_path,
      api_query,
      api_body,
      api_err_msg,
      api_err_stack,
    });
    return result;
  }

  /** 删除日志 */
  async delete(id: number) {
    const result = await logModel.destroy({
      where: { id },
      individualHooks: true,
    });
    return result;
  }
}

export default new LogService();