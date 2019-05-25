module.exports = function (sequelize, DataTypes) {
  const post = sequelize.define('Post',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      subject: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      read_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      comments_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_secret: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      tableName: 'boards_posts',
      timestamps: true
    })

  post.associate = (models) => {
    models.Post.belongsTo(models.Board, {
      foreignKey: 'board_id',
      targetKey: 'id'
    })
    models.Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id'
    })
    models.Post.belongsTo(models.User, {
      foreignKey: 'user_srl',
      targetKey: 'user_srl'
    })
    models.Post.belongsTo(models.User, {
      foreignKey: 'user_nickname',
      targetKey: 'user_nickname'
    })
    models.Post.hasMany(models.PostComment, {
      foreignKey: 'post_id',
      sourceKey: 'id'
    })
  }

  return post
}
