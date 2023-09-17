import { PrismaClient } from '@prisma/client'
import { userFactory, postFactory, profileFactory, randomInt } from '../factories/user.mjs'

const prisma = new PrismaClient()

async function main() {
	  
	// await prisma.user.createMany({
	// 	 data: [
	// 		userFactory('freelancer'),
	// 		userFactory('client'),
	// 		userFactory('client'),
	// 		userFactory('client'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('agency'),
	// 		userFactory('agency'),
	// 		userFactory('agency'),
	// 		userFactory('agency'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('freelancer'),
	// 		userFactory('client'),
	// 		userFactory('client'),
	// 		userFactory('client'),
	// 		userFactory('client'),
	// 		userFactory('client')
	// 	 ]
	// 	})

	// await prisma.category.createMany({
	// 	data: [
	// 		{ name: 'Node' },
	// 		{ name: 'JavaScript' },
	// 		{ name: 'TypeScript' },
	// 		{ name: 'HTML' },
	// 		{ name: 'CSS' },
	// 		{ name: 'SASS' },
	// 		{ name: 'LESS' },
	// 		{ name: 'Bootstrap' },
	// 		{ name: 'Tailwind' },
	// 		{ name: 'PHP' },
	// 		{ name: 'PHP 7' },
	// 		{ name: 'PHP 8' },
	// 		{ name: 'Express' },
	// 		{ name: 'Lumen' },
	// 		{ name: 'React' },
	// 		{ name: 'React Native' },
	// 		{ name: 'Vue' },
	// 		{ name: 'Angular' },
	// 		{ name: 'Python' },
	// 		{ name: 'Django' },
	// 		{ name: 'Flask' },
	// 		{ name: 'PostgreSQL' },
	// 		{ name: 'MongoDB' },
	// 		{ name: 'MySQL' },
	// 		{ name: 'Laravel' },
	// 		{ name: 'AWS Lambda' },
	// 		{ name: 'AWS ElasticBeanstalk' },
	// 		{ name: 'AWS Elastic Cache' },
	// 		{ name: 'AWS API Gateway' },
	// 		{ name: 'AWS S3' },
	// 		{ name: 'AWS EC2' },
	// 		{ name: 'AWS RDS' },
	// 		{ name: 'AWS CloudFront' },
	// 		{ name: 'AWS CloudWatch' },
	// 		{ name: 'AWS CloudFormation' },
	// 		{ name: 'AWS CodeDeploy' },
	// 		{ name: 'AWS CodePipeline' },
	// 		{ name: 'AWS CodeCommit' },
	// 		{ name: 'AWS CodeBuild' },
	// 		{ name: 'AWS CodeStar' },
	// 		{ name: 'AWS X-Ray' },
	// 		{ name: 'AWS CloudTrail' },
	// 		{ name: 'AWS Step Functions' },
	// 		{ name: 'AWS Serverless Application Model (SAM)' },
	// 		{ name: 'AWS AppSync' },
	// 		{ name: 'AWS Amplify' },
	// 		{ name: 'AWS Cloud9' },
	// 		{ name: 'AWS Chalice' },
	// 		{ name: 'AWS Serverless Application Repository' }
	// 	],
	// 	skipDuplicates: true
	// })

	// let users = await prisma.user.findMany({ include: { profile: true, posts: true } })

	// // Create a few profiles, should write factory methods
	// // to attach profiles to every created user
	// await prisma.profile.createMany({
	// 	data: [
	// 		profileFactory(users[0].id),
	// 		profileFactory(users[1].id),
	// 		profileFactory(users[2].id),
	// 		profileFactory(users[3].id),
	// 		profileFactory(users[4].id),
	// 		profileFactory(users[5].id),
	// 		profileFactory(users[6].id),
	// 		profileFactory(users[7].id),
	// 	]
	// })

	// await prisma.post.createMany({
	//  data: [
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	// 	postFactory(users),
	//  ]})

	// let posts = await prisma.post.findMany()
	// let categories = await prisma.category.findMany()

	// // Attach categories to posts,
	// // and attach posts to users
	//  for (let post of posts) {
	// 	 await prisma.post.update({
	// 		 where: { id: post.id },
	// 		 data: {
	// 			 categories: {
	// 				 connect: [
	// 					 { id: categories[randomInt(0, categories.length-1)].id },
	// 					 { id: categories[randomInt(0, categories.length-1)].id },
	// 					 { id: categories[randomInt(0, categories.length-1)].id },
	// 				 ]
	// 			 }
	// 		}
	// 	 })
	//  }

	// await prisma.skill.createMany({
	// 	data: [
	// 		{ name: 'Node' },
	// 		{ name: 'JavaScript' },
	// 		{ name: 'TypeScript' },
	// 		{ name: 'HTML' },
	// 		{ name: 'CSS' },
	// 		{ name: 'SASS' },
	// 		{ name: 'LESS' },
	// 		{ name: 'Bootstrap' },
	// 		{ name: 'Tailwind' },
	// 		{ name: 'PHP' },
	// 		{ name: 'PHP 7' },
	// 		{ name: 'PHP 8' },
	// 		{ name: 'Express' },
	// 		{ name: 'Lumen' },
	// 		{ name: 'React' },
	// 		{ name: 'NextJS' },
	// 		{ name: 'NuxtJS' },
	// 		{ name: 'Gatsby' },
	// 		{ name: 'Svelte' },
	// 		{ name: 'MobX' },
	// 		{ name: 'Redux' },
	// 		{ name: 'Zustand' },
	// 		{ name: 'Jotai' },
	// 		{ name: 'Recoil' },
	// 		{ name: 'React Context' },
	// 		{ name: 'React Hooks' },
	// 		{ name: 'React Router' },
	// 		{ name: 'React Query' },
	// 		{ name: 'React Final Form' },
	// 		{ name: 'React Hook Form' },
	// 		{ name: 'React Testing Library' },
	// 		{ name: 'Jest' },
	// 		{ name: 'Enzyme' },
	// 		{ name: 'Mocha' },
	// 		{ name: 'Chai' },
	// 		{ name: 'Cypress' },
	// 		{ name: 'Jasmine' },
	// 		{ name: 'Vue' },
	// 		{ name: 'Vue Router' },
	// 		{ name: 'Vuex' },
	// 		{ name: 'NuxtJS' },
	// 		{ name: 'Quasar Framework' },
	// 		{ name: 'Vuetify' },
	// 		{ name: 'Angular' },
	// 		{ name: 'AngularJS' },
	// 		{ name: 'Angular Material' },
	// 		{ name: 'RxJS' },
	// 		{ name: 'Python' },
	// 		{ name: 'Django' },
	// 		{ name: 'Flask' },
	// 		{ name: 'PostgreSQL' },
	// 		{ name: 'MongoDB' },
	// 		{ name: 'MySQL' },
	// 		{ name: 'Laravel' },
	// 		{ name: 'Java' },
	// 		{ name: 'C#' },
	// 		{ name: 'C++' },
	// 		{ name: 'C' },
	// 		{ name: 'Go' },
	// 		{ name: 'Ruby' },
	// 		{ name: 'Rust' },
	// 		{ name: 'Swift' },
	// 		{ name: 'Kotlin' },
	// 		{ name: 'Rails' },
	// 		{ name: 'Spring' },
	// 		{ name: 'Android' },
	// 		{ name: 'iOS' },
	// 		{ name: 'Flutter' },
	// 		{ name: 'React Native' },
	// 		{ name: 'Xamarin' },
	// 		{ name: 'Ionic' },
	// 		{ name: 'Cordova' },
	// 		{ name: 'Capacitor' },
	// 		{ name: 'Pinia' },
	// 		{ name: 'Vuex' },
	// 		{ name: 'Easy-Peasy' },
	// 		{ name: 'React Query' },
	// 		{ name: 'React Native' },
	// 		{ name: 'Vue' },
	// 		{ name: 'Angular' },
	// 		{ name: 'Python' },
	// 		{ name: 'Django' },
	// 		{ name: 'Flask' },
	// 		{ name: 'PostgreSQL' },
	// 		{ name: 'MongoDB' },
	// 		{ name: 'MySQL' },
	// 		{ name: 'Laravel' },
	// 		{ name: 'Java' },
	// 		{ name: 'C#' },
	// 		{ name: 'C++' },
	// 		{ name: 'C' },
	// 		{ name: 'Go' },
	// 		{ name: 'Ruby' },
	// 		{ name: 'Rust' },
	// 		{ name: 'Swift' },
	// 		{ name: 'Kotlin' },
	// 		{ name: 'Rails' },
	// 		{ name: 'Spring' },
	// 		{ name: 'Android' },
	// 		{ name: 'iOS' },
	// 		{ name: 'Flutter' },
	// 		{ name: 'React Native' },
	// 		{ name: 'Xamarin' },
	// 		{ name: 'Ionic' },
	// 		{ name: 'Cordova' },
	// 		{ name: 'Capacitor' },
	// 		{ name: 'Quasar Framework' },
	// 		{ name: 'Framework7' },
	// 		{ name: 'Object Oriented Programming' },
	// 		{ name: 'Electron' },
	// 		{ name: 'Unity' },
	// 		{ name: 'Docker' },
	// 		{ name: 'Kubernetes' },
	// 		{ name: 'AWS' },
	// 		{ name: 'Azure' },
	// 		{ name: 'Google Cloud' },
	// 		{ name: 'Heroku' },
	// 		{ name: 'Digital Ocean' },
	// 		{ name: 'AWS Lambda' },
	// 		{ name: 'AWS ElasticBeanstalk' },
	// 		{ name: 'AWS Elastic Cache' },
	// 		{ name: 'AWS API Gateway' },
	// 		{ name: 'AWS S3' },
	// 		{ name: 'AWS EC2' },
	// 		{ name: 'AWS RDS' },
	// 		{ name: 'AWS CloudFront' },
	// 		{ name: 'AWS CloudWatch' },
	// 		{ name: 'AWS CloudFormation' },
	// 		{ name: 'AWS CodeDeploy' },
	// 		{ name: 'AWS CodePipeline' },
	// 		{ name: 'AWS CodeCommit' },
	// 		{ name: 'AWS CodeBuild' },
	// 		{ name: 'AWS CodeStar' },
	// 		{ name: 'AWS X-Ray' },
	// 		{ name: 'AWS CloudTrail' },
	// 		{ name: 'AWS Step Functions' },
	// 		{ name: 'AWS Serverless Application Model (SAM)' },
	// 		{ name: 'AWS AppSync' },
	// 		{ name: 'AWS Amplify' },
	// 		{ name: 'AWS Cloud9' },
	// 		{ name: 'AWS Chalice' },
	// 		{ name: 'AWS Serverless Application Repository' },
	// 		{ name: 'GitHub' },
	// 		{ name: 'GitLab' },
	// 		{ name: 'BitBucket' },
	// 		{ name: 'Jira' },
	// 		{ name: 'Confluence' },
	// 		{ name: 'Trello' },
	// 		{ name: 'Asana' },
	// 		{ name: 'Google Docs' },
	// 		{ name: 'Google Sheets' },
	// 		{ name: 'Google Slides' },
	// 		{ name: 'Google Drive' },
	// 		{ name: 'Google Calendar' },
	// 		{ name: 'Google Hangouts' },
	// 		{ name: 'Google Chat' },
	// 		{ name: 'Google Forms' },
	// 		{ name: 'Google Keep' },
	// 		{ name: 'Google Sites' },
	// 		{ name: 'Google Jamboard' },
	// 		{ name: 'Google Cloud Search' },
	// 		{ name: 'Google Cloud Platform' },
	// 		{ name: 'Google Cloud Console' },
	// 		{ name: 'Google Cloud Shell' },
	// 		{ name: 'Google Cloud SDK' },
	// 		{ name: 'Google Cloud Bigtable' },
	// 		{ name: 'Google Cloud BigQuery' },
	// 		{ name: 'Google Cloud SQL' },
	// 		{ name: 'Google Cloud Spanner' },
	// 		{ name: 'Google Cloud Storage' },
	// 		{ name: 'Google Cloud CDN' },
	// 		{ name: 'Google Cloud DNS' },
	// 		{ name: 'Google Cloud Load Balancing' },
	// 		{ name: 'Google Cloud Armor' },
	// 		{ name: 'Google Cloud Interconnect' },
	// 		{ name: 'Google Cloud VPN' },
	// 		{ name: 'Google Cloud NAT' },
	// 		{ name: 'Google Cloud Router' },
	// 		{ name: 'Azure Cloud Functions' },
	// 		{ name: 'Azure App Service' },
	// 		{ name: 'Azure Logic Apps' },
	// 		{ name: 'Azure Event Grid' },
	// 		{ name: 'Azure Event Hubs' },
	// 		{ name: 'Azure Service Bus' },
	// 		{ name: 'Azure Relay' },
	// 		{ name: 'Azure API Management' },
	// 		{ name: 'Azure Kubernetes Service' },
	// 		{ name: 'Azure Container Instances' },
	// 		{ name: 'Azure Container Registry' },
	// 		{ name: 'Azure Batch' },
	// 		{ name: 'Azure Batch AI' },
	// 		{ name: 'Azure Machine Learning Service' },
	// 		{ name: 'Azure Machine Learning Studio' },
	// 		{ name: 'Azure Databricks' },
	// 		{ name: 'Azure HDInsight' },
	// 		{ name: 'Azure Data Lake Analytics' },
	// 		{ name: 'Azure Data Factory' },
	// 		{ name: 'Azure Data Catalog' },
	// 		{ name: 'Azure Data Lake Storage' },
	// 		{ name: 'Azure SQL Database' },
	// 		{ name: 'Azure Database for MySQL' },
	// 		{ name: 'Azure Database for PostgreSQL' },
	// 		{ name: 'Azure Database Migration Service' },
	// 		{ name: 'Azure Cache for Redis' },
	// 		{ name: 'Azure Cosmos DB' },
	// 		{ name: 'Azure Search' },
	// 		{ name: 'Azure SQL Data Warehouse' },
	// 		{ name: 'Azure Analysis Services' },
	// 		{ name: 'Azure Data Explorer' },
	// 		{ name: 'Azure Data Box' },
	// 		{ name: 'Azure Data Box Edge' },
	// 		{ name: 'Azure Data Box Gateway' },
	// 		{ name: 'Azure Data Share' },
	// 		{ name: 'Azure Data Box Disk' },
	// 		{ name: 'Azure Data Box Heavy' }
	// 	],
	// 	skipDuplicates: true
	// })
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})

	.catch(async (e) => {
		console.error(e)

		await prisma.$disconnect()

		process.exit(1)
	})
