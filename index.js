import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';

const MONGODB = 1;
const MYSQL = 2;

class Database {
	constructor(dburl) {
		this.dburl = dburl;

		if (dburl.startsWith("mongodb")) {
			this.type = MONGODB;

			const schema = new mongoose.Schema({
				domain: String,
				path: String,
				count: { type: Number, default: 1 }
			});
			this.PageViews = mongoose.model('PageViews', schema, "PageViews");
		}

		else if (dburl.startsWith("mysql")) {
			this.type = MYSQL;
			this.dburl = `${dburl}?multipleStatements=true`;
		}
		
		else {
			this.type = MYSQL;
			console.log("Unknown database type!");
		}
	}

	async Connection() {
		if (this.type === MONGODB) {
			await mongoose.connect(this.dburl, {
				// https://mongoosejs.com/docs/connections.html#serverselectiontimeoutms
				serverSelectionTimeoutMS: 10000
			});
		}
		else if (this.type === MYSQL) {
			this.connection = await mysql.createConnection(this.dburl);
			const CreateTable = `CREATE TABLE IF NOT EXISTS pageviews 
				(_id INT AUTO_INCREMENT PRIMARY KEY, domain VARCHAR(255), path VARCHAR(255), count INT, UNIQUE KEY domain_path (domain, path))`;
			await this.connection.execute(CreateTable);
		}
	}

	async Query(req, res) {
		if (this.type === MONGODB) {
			const result = await this.PageViews.findOneAndUpdate(
				{ domain: req.body.domain, path: req.body.path },
				{ $inc: { count: 1 } },
				{ new: true, upsert: true }
			);
			return res.status(200).json(result);
		}
		else if (this.type === MYSQL) {
			const domain = req.body.domain;
			const path = req.body.path;
			const query = `INSERT INTO pageviews (domain, path, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1;
				SELECT * FROM pageviews WHERE domain = ? AND path = ?`;
			const [results] = await this.connection.query(query, [domain, path, domain, path]);
			return res.status(200).json(results[1][0]);
		}
	}
}

function closeServer(server) {
	console.log('Server closed.');
	server.close();
	process.exit(0);
}

async function main() {
	const dburl = process.env.DBURL || 'mongodb://127.0.0.1:27017/pagecounter';
	const port = process.env.PORT || 3005;

	const database = new Database(dburl);
	await database.Connection();

	const app = express();
	app.use(express.json());
	app.use(cors());
	app.post('/pageviews', database.Query.bind(database));

	const server = app.listen(port, () => {
		console.log(`Server is running on port: ${port}`);
	});

	process.on('SIGINT', () => closeServer(server));
	process.on('SIGTERM', () => closeServer(server));
	process.on('SIGHUP', () => closeServer(server));
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
