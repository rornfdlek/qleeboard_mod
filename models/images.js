module.exports = function (sequelize, DataTypes) {
  const image = sequelize.define('Image',
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
      img_url: {
        type: DataTypes.STRING(250),
        allowNull: false
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
      tableName: 'images',
      timestamps: true
    })

  image.associate = (models) => {
    models.Image.belongsTo(models.Post, {
      foreignKey: 'post_id',
      targetKey: 'id'
    })
  }

  return image
}
