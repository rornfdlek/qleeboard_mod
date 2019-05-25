module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('boards_posts',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        subject: {
          type: Sequelize.STRING(250),
          allowNull: false
        },
        contents: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        read_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        comments_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        board_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        is_secret: {
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
    return queryInterface.dropTable('posts')
  }
}
