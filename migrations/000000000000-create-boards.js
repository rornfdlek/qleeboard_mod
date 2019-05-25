module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('boards',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        description: {
          type: Sequelize.STRING(250),
          allowNull: false
        },
        is_readonly: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        is_anonymous: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        require_auth: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        deleted_at: Sequelize.DATE
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('boards')
  }
}
