import express from 'express';
import { relative, join } from 'path';
import { processSchema } from './schema';
import recursiveReaddir from 'recursive-readdir';

const app = express();

export default app;

app.use('/dist', express.static(join(__dirname, '../dist')));
app.use(express.static(join(__dirname, '../client')));

app.set('schemaPath', join(__dirname, '../../examples'));

app.get('/schemas', (req, res, next) => {
	var schemaPath = req.app.get('schemaPath');

	recursiveReaddir(schemaPath, ['!*.json'], (err, files) => {
		if (err) {
			return next(err);
		}

		res.json(files.map(file => relative(schemaPath, file)));
	});
});

app.get('/schemas/*', function(req, res, next) {
	try {
		res.send(processSchema(join(req.app.get('schemaPath'), req.params[0])));
	} catch(e) {
		next(e);
	}
});

app.start = (callback = function() {}) => {
	var server = app.listen(app.get('port') || 3000, app.get('hostname') || 'localhost', (err) => {
		var url, address;

		if (err) {
			callback(err);
		}

		address = server.address();
		url = `http://${address.address}:${address.port}/`;

		console.log(err || `Visit ${url}`);

		callback(null, url);
	});
};

if ((module.parent && !module.parent.parent)) {
	app.start();
}
