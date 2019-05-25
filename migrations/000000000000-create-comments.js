module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('comments',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        post_id: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        user_id: {
          type: Sequelize.STRING(250)
        },
        contents: {
          type: Sequelize.TEXT
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        deleted_at: Sequelize.DATE
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('comments')
  }
}
