import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const schema = new mongoose.Schema({
	domain: String,
	path: String,
	count: { type: Number, default: 1 }
});

function closeServer(server) {
	console.log('Server closed.');
	server.close();
	process.exit(0);
}

async function main() {
	const db = process.env.DBURI || 'mongodb://127.0.0.1:27017/pagecounter';
	const port = process.env.PORT || 3005;

	const PageViews = mongoose.model('PageViews', schema, "PageViews");
	await mongoose.connect(db, {
		// https://mongoosejs.com/docs/connections.html#serverselectiontimeoutms
		serverSelectionTimeoutMS: 10000
	});

	const app = express();
	app.use(express.json());
	app.use(cors());

	app.post('/pageviews', async (req, res) => {
		const result = await PageViews.findOneAndUpdate(
			{ domain: req.body.domain, path: req.body.path },
			{ $inc: { count: 1 } },
			{ new: true, upsert: true }
		);
		return res.json(result);
	});

	const server = app.listen(port, () => {
		console.log(`Server is running on port: ${port}`);
	});

	process.on('SIGINT', () => closeServer(server));
	process.on('SIGTERM', () => closeServer(server));
	process.on('SIGHUP', () => closeServer(server));
}

main().catch(err => console.error(err));
