const express = require('express')
const passport = require('passport')
const prisma = require('../prismaclient')

const router = express.Router()

router.get('/api/v1/applications', async (req, res) => {
	let applications = await prisma.application.findMany({ where: { userId: req.user.sub } })

	if (!applications) {
		return res.status(404).json({
			success: false,
			error: 'No applications found'
		})
	}

	return res.json({
		success: true,
		applications: applications
	})
})

// TODO: should this really be in search?
router.get('/api/v1/applications/job/:jobid', async (req, res) => {
	let applications = await prisma.application.findFirst({ where: { jobId: req.params.job } })

	// Not exactly an error condition
	if (!applications) {
		return res.status(404).json({
			success: false,
			error: 'No applications found for that job ID'
		})
	}

	return res.json({
		success: true,
		applications: applications
	})
})

router.get('/api/v1/applications/:id', async (req, res) => {
	let applications = await prisma.application.findFirst({ where: { AND: { userId: req.user.sub, id: req.params.id } } })

	if (!applications) {
		return res.status(404).json({
			success: false,
			error: 'No applications found for that ID'
		})
	}

	return res.json({
		success: true,
		applications: applications
	})
})

router.post('/api/v1/applications', async (req, res) => {

	const existing = await prisma.application.findFirst({ where: { AND: { userId: req.user.sub, jobId: req.body.jobId } } })
	
	if (existing) {
		return res.status(400).json({
			success: false,
			error: 'You have already applied for this job'
		})
	}
	
	const application = await prisma.application.create({
		data: {
			amount: req.body.amount,
			coverLetter: req.body.coverLetter,
			status: 'pending',
			delivery: req.body.delivery,
			jobId: req.body.jobId,
			userId: req.user.sub
		}
	})

	return res.status(201).json({
		success: true,
		application: application
	})
})

router.patch('/api/v1/applications/:id', async (req, res) => {
	let updateFields = {}

	if (req.body.name) {
		updateFields.amount = req.body.amount
	}

	if (req.body.coverLetter) {
		updateFields.coverLetter = req.body.coverLetter
	}

	if (req.body.delivery) {
		updateFields.delivery = req.body.delivery
	}

	const application = await prisma.application.update({
		where: {
			id: req.params.id
		},
		data: {
			...updateFields
		}
	})

	return res.json({
		success: true,
		application: application
	})
})

router.delete('/api/v1/applications/:id', async (req, res) => {
	
	// Prisma complains about a missing ID if trying to delete with an AND clause
	// TODO: security checks across all routes where AND is problematic

	const application = await prisma.application.delete({
		where: {
			id: req.params.id
		}
	})

	return res.json({
		success: true,
		application: application
	})
})
