const express = require('express')
const router = express.Router()
const prisma = require('../prismaclient')
const AWS = require('aws-sdk')
const argon2 = require('argon2')
const { DateTime } = require('luxon')

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

router.get('/api/v1/profile', async (req, res) => {
	let profile = await prisma.profile.findFirst({ where: { userId: req.user.sub }, include: { user: true } })

	return res.json({
		success: true,
		profile: profile
	})
})

router.get('/api/v1/user', async (req, res) => {

	let user = await prisma.user.findFirst({ where: { id: req.user.sub }, include: { profile: true } })

	return res.json({
		success: true,
		user: user
	})
})

router.patch('/api/v1/user', async (req, res) => {
	let updateData = {}

	if (req.body.email) {
		updateData.email = req.body.email
	}

	if (req.body.password) {
		updateData.password_hash = await argon2.hash(password, { type: argon2.argon2id })
	}

	if (req.body.account_type) {
		// Ensure it's freelancer, client, or agency only
		updateData.userType = req.body.account_type
	}

	if (req.body.active) {
		// account active or not
		updateData.active = req.body.active
	}

	if (req.body.name) {
		updateData.name = req.body.name
	}

	if (req.body.skills) {
		// Update skills table if necessary, merge new ones into existing ones
	}

	let user = await prisma.user.update({
		where: {
			id: req.user.sub
		},
		data: {
			...updateData
		},
		include: {
			profile: true
		}
	})

	return res.json({
		success: true,
		user: user
	})
})

router.post('/api/v1/profile', async (req, res) => {

	if (typeof req.body.bio !== 'string' && typeof req.body.avatar !== 'string') {
		return res.status(400).json({
			success: false,
			error: 'Must provide at least one of bio or avatar'
		})
	}

	let createFields = {
		userId: req.user.sub
	}

	if (req.body.bio) {
		createFields.bio = req.body.bio
	}

	// Upload profile pic to S3, then store S3 URL in DB
	if (req.body.avatar) {
		let originalFileName = req.body.filename
		let mimeType = originalFileName.split('.').pop()

		const filename = `${req.user.sub}/${DateTime.now().toFormat('yyyyLLddhhmmssSSS')}.${mimeType}`
		const fileContent = Buffer.from(req.body.avatar, 'base64')

		console.log(`Uploading ${filename} to S3`)

		const params = {
			Bucket: process.env.S3_BUCKET,
			Key: filename, // File name you want to save as in S3
			Body: fileContent
		}

		let loc

		try {
			loc = await s3.upload(params).promise()
		} catch (err) {
			return res.status(500).json({
				success: false,
				error: err
			})
		}

		createFields.avatar = loc.Location ?? JSON.stringify(loc, null, 2)
	}

	const profile = await prisma.profile.upsert({
		create: {
			...createFields
		},
		update: {
			...createFields
		},
		where: {
			userId: req.user.sub
		},
		include: {
			user: true
		}
	})

	return res.json({
		success: true,
		profile: profile
	})
})

router.patch(
	'/api/v1/profile/:id',

	async (req, res) => {
		// If the categories in the POSTed data don't exist, create them
		let categories = await prisma.category.findMany()
		let requestedCategories = req.body.categories ?? []
		let created = []

		for (c of requestedCategories) {
			if (!categories.find((cg) => cg.name === c)) {
				let rc = await prisma.category.create({
					data: {
						name: c
					}
				})
				created.push(rc)
			}
		}

		// Merge cats
		categories = [...categories, ...created]
		categories = categories.filter((c) => requestedCategories.includes(c.name))

		let connectMap = categories.map((c) => {
			return { id: c.id }
		})

		let createFields = {
			title: req.body.title,
			content: req.body.content,
			authorId: req.user.sub
		}

		if (connectMap.length > 0) {
			createFields.categories = { connect: connectMap }
		}

		const requestedPost = await prisma.post.findFirst({
			where: { AND: { id: req.params.id, authorId: req.user.sub } }
		})
		if (!requestedPost) {
			return res.status(404).json({
				success: false,
				error: `Requested post with ID ${req.params.id} was not found`
			})
		}

		const post = await prisma.post.update({
			where: {
				id: req.params.id
			},
			data: {
				...createFields
			},
			include: {
				categories: true
			}
		})

		return res.json({
			success: true,
			post: post
		})
	}
)

module.exports = router
