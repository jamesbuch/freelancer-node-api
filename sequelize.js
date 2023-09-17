require('dotenv').config()

// TODO: Place all database stuff in separate module
const { Sequelize, Op, DataTypes, Model } = require('sequelize')
const sequelize = new Sequelize(`postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:5432/api`)

module.exports = {
	sequelize
}
