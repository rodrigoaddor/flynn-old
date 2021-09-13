import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { container } from 'tsyringe';

import { Database } from '../../utils/symbols';

interface KarmaAttributes {
  member: string;
  karma: number;
}

interface KarmaCreationAttributes extends Optional<KarmaAttributes, 'karma'> {}

export class KarmaData extends Model<KarmaAttributes, KarmaCreationAttributes> implements KarmaAttributes {
  public member!: string;

  public karma!: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  static start() {
    KarmaData.init(
      {
        member: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true },
        karma: { type: DataTypes.NUMBER, allowNull: false, defaultValue: 0 },
      },
      { sequelize: container.resolve<Sequelize>(Database), modelName: 'Karma' }
    );
  }
}
