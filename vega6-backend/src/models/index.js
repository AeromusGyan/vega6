const {sequelize, connectDB, Model, Sequelize, DataTypes} = require('../config/db');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes, Model);
db.Role = require('./role')(sequelize, DataTypes, Model);
db.UserRoles = require('./userRole')(sequelize, DataTypes, Model);
db.Image = require('./Image')(sequelize, DataTypes, Model);
db.Blog = require('./Blog')(sequelize, DataTypes, Model);
db.Reply = require('./Reply')(sequelize, DataTypes, Model);

// User and Role
db.Role.hasMany(db.UserRoles, {onDelete: 'CASCADE', onUpdate: 'CASCADE'});
db.UserRoles.belongsTo(db.Role, {onDelete: 'CASCADE', onUpdate: 'CASCADE'});

db.User.hasMany(db.UserRoles, {as: "userRoles"});
db.UserRoles.belongsTo(db.User, {onDelete: 'CASCADE', onUpdate: 'CASCADE'});

db.Image.hasOne(db.User, {
    as: 'users',
    foreignKey: 'profile_id',
});
db.User.belongsTo(db.Image, {
    as: 'profile',
    foreignKey: 'profile_id',
});
db.Image.hasOne(db.Blog, {
    as: 'blog',
    foreignKey: 'thumbnail_id',
});
db.Blog.belongsTo(db.Image, {
    as: 'thumbnail',
    foreignKey: 'thumbnail_id',
});
db.Blog.hasMany(db.Reply, {
    foreignKey: 'blogId',
    as: 'replies'
});

// Reply Model
db.Reply.belongsTo(db.Blog, {
    foreignKey: 'blogId',
    as: 'blog'
});

db.sequelize.sync({alter: false}).then(() => {
    console.log('Database synced successfully!');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

// Export all models
module.exports = {
    db,
    User: db.User,
    Role: db.Role,
    UserRoles: db.UserRoles
}
