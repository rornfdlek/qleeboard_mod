module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users',
      {
        user_srl: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.STRING(45),
          allowNull: false,
          unique: true
        },
        email_address: {
          type: Sequelize.STRING(45),
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        user_nickname: {
          type: Sequelize.STRING(45),
          allowNull: false,
          unique: true
        },
        last_login: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        is_admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        salt: {
          type: Sequelize.STRING
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        deleted_at: Sequelize.DATE
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
}
