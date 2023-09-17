const express = require('express')
const router = express.Router()
const prisma = require('../prismaclient')
const AWS = require('aws-sdk')
const { DateTime } = require('luxon')

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

router.get('/api/v1/services', async (req, res) => {
	let service = await prisma.service.findMany({ where: { userId: req.user.sub } })

	return res.json({
		success: true,
		service: service
	})
})

router.get('/api/v1/services/:id', async (req, res) => {
	let services = await prisma.service.findFirst({ where: { AND: { userId: req.user.sub, id: req.params.id } } })

	if (!services) {
		return res.status(404).json({
			success: false,
			error: 'No service found for that ID'
		})
	}

	return res.json({
		success: true,
		service: services
	})
})

router.post('/api/v1/services', async (req, res) => {
	let imageLocation

	// Upload image to S3, then store S3 URL in DB
	if (req.body.image) {
		let originalFileName = req.body.filename
		let mimeType = originalFileName.split('.').pop()

		const filename = `${req.user.sub}/${DateTime.now().toFormat('yyyyLLddhhmmssSSS')}.${mimeType}`
		const fileContent = Buffer.from(req.body.image, 'base64')

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

		imageLocation = loc.Location ?? JSON.stringify(loc, null, 2)
	}

	const service = await prisma.service.create({
		data: {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			image: imageLocation ?? null,
			jobQueue: req.body.jobQueue ?? 0,
			jobQueueLimit: req.body.jobQueueLimit ?? 1,
			userId: req.user.sub
		}
	})

	return res.status(201).json({
		success: true,
		service: service
	})
})

router.patch('/api/v1/services/:id', async (req, res) => {
	let updateFields = {}

	if (req.body.name) {
		updateFields.name = req.body.name
	}

	if (req.body.description) {
		updateFields.description = req.body.description
	}

	if (req.body.price) {
		updateFields.price = req.body.price
	}

	let imageLocation

	// Upload image to S3, then store S3 URL in DB
	if (req.body.image) {
		let originalFileName = req.body.filename
		let mimeType = originalFileName.split('.').pop()

		const filename = `${req.user.sub}/${DateTime.now().toFormat('yyyyLLddhhmmssSSS')}.${mimeType}`
		const fileContent = Buffer.from(req.body.image, 'base64')

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

		imageLocation = loc.Location ?? JSON.stringify(loc, null, 2)
		updateFields.image = imageLocation
	}

	const service = await prisma.service.upsert({
		create: {
			name: req.body.name,
			description: req.body.description,
			image: imageLocation ?? null,
			price: req.body.price,
			jobQueue: req.body.jobQueue ?? 0,
			jobQueueLimit: req.body.jobQueueLimit ?? 1,
			userId: req.user.sub
		},
		update: {
			...updateFields
		},
		where: {
			AND: {
				id: req.params.id,
				userId: req.user.sub
			}
		}
	})

	return res.json({
		success: true,
		service: service
	})
})

router.delete('/api/v1/services/:id', async (req, res) => {
	// ensure this service belongs to the logged in user!
	const service = await prisma.service.delete({
		where: {
			id: req.params.id
		}
	})

	if (service.image) {
		// An image URL looks like this:
		// https://freelancer-asset-storage.s3.amazonaws.com/0d27e937-abb4-4553-adc9-64ba935ed6e4/20230916075838891.svg
		// Everything after the .com is the key

		const s3Key = service.image.split(/.+?\.com\//)

		const rc = await s3
			.deleteObject({
				Bucket: process.env.S3_BUCKET,
				Key: s3Key[1]
			})
			.promise()
	}

	return res.json({
		success: true,
		message: 'Service deleted',
		service: service
	})
})

module.exports = router
