module.exports = function (sequelize, DataTypes) {
  const board = sequelize.define('Board',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      is_readonly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      require_auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      order_num: {
        type: DataTypes.INTEGER
      }
    },
    {
      // don't use camelcase for automatically added attributes but underscore style
      // so updatedAt will be updated_at
      underscored: true,
      // disable the modification of tablenames; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: true,
      paranoid: true,
      // define the table's name
      tableName: 'boards',
      timestamps: true
    })

  return board
}
