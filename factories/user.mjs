import { faker } from '@faker-js/faker'
import argon2 from 'argon2'

const password = await argon2.hash('password', { type: argon2.argon2id })

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const postFactory = (users) => ({
	title: faker.lorem.sentence(),
	content: faker.lorem.paragraphs(randomInt(1, 10)),
	published: true,
	authorId: users[randomInt(0, users.length - 1)].id
})

const profileFactory = (userid) => ({
	bio: faker.lorem.paragraph(randomInt(1, 10)),
	avatar: faker.image.avatar(),
	userId: userid
})

const userFactory = (userType) => ({
	email: faker.internet.email(),
	name: faker.person.fullName(),
	password_hash: password,
	active: true,
	userType: userType
})

export { userFactory, profileFactory, postFactory, randomInt }
