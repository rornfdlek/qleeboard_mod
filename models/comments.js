module.exports = function (sequelize, DataTypes) {
  const comment = sequelize.define('PostComment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_srl: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      user_nickname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
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
      tableName: 'comments',
      timestamps: true
    })

  comment.associate = (models) => {
    models.PostComment.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id'
    })
    models.PostComment.belongsTo(models.User, {
      foreignKey: 'user_srl',
      targetKey: 'user_srl'
    })
    models.PostComment.belongsTo(models.User, {
      foreignKey: 'user_nickname',
      targetKey: 'user_nickname'
    })
    models.PostComment.belongsTo(models.Post, {
      foreignKey: 'post_id',
      targetKey: 'id'
    })
  }

  return comment
}
