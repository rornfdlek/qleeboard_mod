module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('images',
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
        img_url: {
          type: Sequelize.STRING(250),
          allowNull: false
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        deleted_at: Sequelize.DATE
      }
    )
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('images')
  }
}
