const express = require('express')
const router = express.Router()
const prisma = require('../prismaclient')


// TODO: it might make more sense to do this in the frontend
// eg. if user is searching for jobs, then they should be able to
// filter by job type, budget, etc quickly with a full set of
// jobs loaded for responsive searching, which refreshes every
// so often... by websocket?

// TODO: add pagination, also return by default only open jobs
// and those with no applications, etc, but also only new ones

router.post('/api/v1/search/jobs', async (req, res) => {

	// Apply filters on returned results
	let jobs = await prisma.job.findMany({ where: { status: 'open' }})

	return res.json({
		success: true,
		jobs: jobs
	})
})

router.post('/api/v1/search/services', async (req, res) => {

	// Apply filters on returned results
	let services = await prisma.service.findMany()

	return res.json({
		success: true,
		services: services
	})
})

// eg with specific categories, keywords, relevance full text search, etc
router.post('/api/v1/search/posts', async (req, res) => {
	
	// Apply filters on returned results
	let posts = await prisma.post.findMany()

	return res.json({
		success: true,
		posts: posts
	})
})

// eg with specific skills, ratings, etc
router.post('/api/v1/search/freelancers', async (req, res) => {
	
	// Apply filters on returned results
	let freelancers = await prisma.user.findMany({ where: { userType: 'freelancer' } })

	return res.json({
		success: true,
		freelancers: freelancers
	})
})

// eg those with open jobs, having no applications, in certain country,
// paying > X, etc
router.post('/api/v1/search/clients', async (req, res) => {
	
	// Apply filters on returned results
	let clients = await prisma.user.findMany({ where: { userType: 'client' } })

	return res.json({
		success: true,
		clients: clients
	})
})

router.post('/api/v1/search/agencies', async (req, res) => {
	
	// Apply filters on returned results
	let agencies = await prisma.job.findMany({ where: { userType: 'agency' } })

	return res.json({
		success: true,
		agencies: agencies
	})
})

module.exports = router
