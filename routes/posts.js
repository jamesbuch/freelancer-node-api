const express = require('express')
const router = express.Router()
const prisma = require('../prismaclient')

router.get('/api/v1/posts', async (req, res) => {
	let posts = await prisma.post.findMany({ where: { authorId: req.user.sub }, include: { categories: true } })

	return res.json({
		success: true,
		posts: posts
	})
})

router.get('/api/v1/posts/:id', async (req, res) => {
	let posts = await prisma.post.findFirst({
		where: { AND: { authorId: req.user.sub, id: req.params.id } },
		include: { categories: true }
	})

	if (!posts) {
		return res.status(404).json({
			success: false,
			error: 'No post found for that ID'
		})
	}

	return res.json({
		success: true,
		posts: posts
	})
})

router.post('/api/v1/posts', async (req, res) => {
	if (req.body.title === undefined || req.body.content === undefined) {
		return res.status(400).json({
			success: false,
			error: 'Missing title or content'
		})
	}

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

	const post = await prisma.post.create({
		data: {
			...createFields
		},
		include: {
			categories: true
		}
	})

	return res.status(201).json({
		success: true,
		post: post
	})
})

router.patch(
	'/api/v1/posts/:id',

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

router.delete('/api/v1/posts/:id', async (req, res) => {
	const requestedPost = await prisma.post.findFirst({ where: { AND: { id: req.params.id, authorId: req.user.sub } } })

	if (!requestedPost) {
		return res.status(404).json({
			success: false,
			error: `Post with ID ${req.params.id} was not found`
		})
	}

	const post = await prisma.post.delete({
		where: {
			id: req.params.id
		}
	})

	return res.json({
		success: true,
		post: post
	})
})

router.get('/api/v1/categories', async (req, res) => {
	let categories = await prisma.category.findMany()

	return res.json({
		success: true,
		categories: categories
	})
})

router.get('/api/v1/categories/:id', async (req, res) => {
	let categories = await prisma.category.findFirst({ where: { id: req.params.id } })

	if (!categories) {
		return res.status(404).json({
			success: false,
			error: 'No category found for that ID'
		})
	}

	return res.json({
		success: true,
		categories: categories
	})
})

router.delete('/api/v1/categories/:id', async (req, res) => {
	return res.status(403).json({
		success: false,
		error: "Can't remove categories"
	})
})

router.patch('/api/v1/categories/:id', async (req, res) => {
	return res.status(403).json({
		success: false,
		error: "Can't update categories"
	})
})

// Create list of tags, merge with already existing
router.post('/api/v1/categories', async (req, res) => {
	let name = req.body.category ?? null

	if (!name) {
		return res.status(400).json({
			success: false,
			error: 'No category name provided'
		})
	}

	let category = await prisma.category.findFirst({ where: { name: name } })

	// If already exists... OK
	if (category) {
		return res.json({
			success: true,
			category: category
		})
	}

	// Otherwise, create it
	category = await prisma.category.create({
		data: {
			name: name
		}
	})

	return res.json({
		success: true,
		category: category
	})
})

module.exports = router
