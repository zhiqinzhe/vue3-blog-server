import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@/config/mysql';
import { IInteractionStatis } from '@/interface';
import { initTable } from '@/utils';

interface IInteractionStatisModel
  extends Model<
      InferAttributes<IInteractionStatisModel>,
      InferCreationAttributes<IInteractionStatisModel>
    >,
    IInteractionStatis {}

const model = sequelize.define<IInteractionStatisModel>(
  'interaction_static',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING(500),
    },
    type: {
      type: DataTypes.STRING(500),
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

initTable({ model, sequelize });
export default model;
