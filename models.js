require('dotenv').config()

// TODO: Place all database stuff in separate module
const { Sequelize, Op, DataTypes, Model } = require('sequelize')
const { sequelize } = require('./sequelize')

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		address: {
			type: DataTypes.STRING
		},
		state: {
			type: DataTypes.ENUM(['NSW', 'ACT', 'QLD', 'VIC', 'TAS', 'SA', 'WA', 'NT'])
		},
		postcode: {
			type: DataTypes.STRING
		},
		mobile: {
			type: DataTypes.STRING
		},
		business_name: {
			type: DataTypes.STRING
		},
		abn: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		timestamps: true
	}
)

const Paste = sequelize.define(
	'Paste',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT
		}
	},
	{
		timestamps: true
	}
)

const Client = sequelize.define(
	'Client',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		address: {
			type: DataTypes.STRING
		},
		state: {
			type: DataTypes.ENUM(['NSW', 'ACT', 'QLD', 'VIC', 'TAS', 'SA', 'WA', 'NT'])
		},
		postcode: {
			type: DataTypes.STRING
		},
		mobile: {
			type: DataTypes.STRING
		}
	},
	{
		timestamps: true
	}
)

const Tag = sequelize.define(
	'Tag',
	{
		tag: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{}
)

module.exports = {
	User,
	Client,
	Paste,
	Tag
}
