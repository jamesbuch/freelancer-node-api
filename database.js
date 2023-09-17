require('dotenv').config()

const { sequelize } = require('./sequelize')
const { User, Client, Paste, Tag } = require('./models')

// Optional stuff for testing connection
// const connect = async () => {
//     await sequelize.authenticate()
// }
//
// connect()

Paste.User = Paste.belongsTo(User)
User.Pastes = User.hasMany(Paste)
User.Clients = User.hasMany(Client)
Client.User = Client.belongsTo(User)
Paste.Tags = Paste.belongsToMany(Tag, { through: 'PasteTags' })
Tag.Pastes = Tag.belongsToMany(Paste, { through: 'PasteTags' })

// if force is true, drop the tables then recreate, otherwise use existing from previous run
sequelize.sync({ force: false }).then((r) => {
	console.log('All models were synchronized successfully.')
})
