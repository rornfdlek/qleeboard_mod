'use strict'
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    user_srl: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    email_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_nickname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    salt: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {},
    tableName: 'users',
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true
  })

  user.associate = (models) => {
    models.User.hasMany(models.PostComment, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    })
    models.User.hasMany(models.PostComment, {
      foreignKey: 'user_srl',
      sourceKey: 'user_srl'
    })
    models.User.hasMany(models.PostComment, {
      foreignKey: 'user_nickname',
      sourceKey: 'user_nickname'
    })
    models.User.hasMany(models.Post, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    })
    models.User.hasMany(models.Post, {
      foreignKey: 'user_srl',
      sourceKey: 'user_srl'
    })
    models.User.hasMany(models.Post, {
      foreignKey: 'user_nickname',
      sourceKey: 'user_nickname'
    })
  }
  return user
}
