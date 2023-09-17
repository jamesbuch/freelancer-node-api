const express = require('express')
const router = express.Router()
const prisma = require('../prismaclient')
const { DateTime } = require('luxon')

router.get('/api/v1/jobs', async (req, res) => {
	let jobs = await prisma.job.findMany({ where: { userId: req.user.sub } })

	return res.json({
		success: true,
		jobs: jobs
	})
})

router.get('/api/v1/jobs/:id', async (req, res) => {
	let jobs = await prisma.job.findFirst({ where: { AND: { userId: req.user.sub, id: req.params.id } } })

	if (!jobs) {
		return res.status(404).json({
			success: false,
			error: 'No jobs found for that ID'
		})
	}

	return res.json({
		success: true,
		jobs: jobs
	})
})

router.post('/api/v1/jobs', async (req, res) => {
	
	const job = await prisma.job.create({
		data: {
			name: req.body.name,
			description: req.body.description,
			jobType: req.body.jobType,
			dueDate: req.body.dueDate ?? DateTime.now().plus({ days: 7 }).toISO(),
			price: req.body.price,
			budget: req.body.budget,
			urgent: req.body.urgent ?? false,
			status: 'open',
			multipleFreelancers: req.body.multipleFreelancers ?? false,
			freelancersRequired: req.body.freelancersRequired ?? 1,
			userId: req.user.sub
		}
	})

	return res.status(201).json({
		success: true,
		job: job
	})
})

router.patch('/api/v1/jobs/:id', async (req, res) => {
	let updateFields = {}

	if (req.body.name) {
		updateFields.name = req.body.name
	}

	if (req.body.description) {
		updateFields.description = req.body.description
	}

	if (req.body.jobType) {
		updateFields.jobType = req.body.jobType
	}

	if (req.body.dueDate) {
		updateFields.dueDate = req.body.dueDate
	}

	if (req.body.price) {
		updateFields.price = req.body.price
	}

	if (req.body.multipleFreelancers) {
		updateFields.multipleFreelancers = req.body.multipleFreelancers
	}

	if (req.body.freelancersRequired) {
		updateFields.freelancersRequired = req.body.freelancersRequired
	}

	if (req.body.urgent) {
		updateFields.urgent = req.body.urgent
	}

	if (req.body.status) {
		updateFields.status = req.body.status
	}

	const job = await prisma.job.upsert({
		create: {
			name: req.body.name,
			description: req.body.description,
			jobType: req.body.jobType,
			dueDate: req.body.dueDate,
			price: req.body.price,
			urgent: req.body.urgent,
			status: 'open',
			multipleFreelancers: req.body.multipleFreelancers,
			freelancersRequired: req.body.freelancersRequired,
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
		job: job
	})
})

router.delete('/api/v1/jobs/:id', async (req, res) => {
	
	// TODO: ensure this job belongs to the currently logged in user!
	const job = await prisma.job.delete({
		where: {
			id: req.params.id
		}
	})

	return res.json({
		success: true,
		message: 'Job deleted',
		job: job
	})
})

module.exports = router
