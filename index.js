var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	YAML = require('yamljs');

function recursiveReaddir(pathName, callback) {
	var paths = [];

	fs.readdir(pathName, (err, files) => {
		if (err) {
			return callback(err);
		}

		(function next() {
			var fileName = files.shift(),
				fullName;

			if (!fileName) {
				return callback(null, paths);
			}

 			fullName = path.join(pathName, fileName);

			fs.stat(fullName, (err, stat) => {
				if (err) {
					return callback(err);
				}

				if (stat.isDirectory()) {
					recursiveReaddir(fullName, (err, items) => {
						if (err) {
							return callback(err);
						}
						paths.push.apply(paths, items);
						next();
					});
				} else {
					paths.push(fullName);
					next();
				}
			});
		})();
	});
}

function processSchema(firstSchemaPath) {
	var schema = require(firstSchemaPath);

	return (function traverse(obj, schema, schemaPath) {
		if (typeof obj === 'object') {
			if ('$ref' in obj) {
				var items = obj.$ref.split('#'),
					fileName = path.resolve(path.dirname(schemaPath), items[0] || path.basename(schemaPath)),
					selector = items[1].split('/'),
					refSchema,
					ref,
					part;

				selector.shift();
				refSchema = ref = (fileName === schemaPath ? schema : require(fileName));

				while(part = selector.shift()) ref = ref[part];

				return traverse(ref, refSchema, fileName);
			}

			if (Array.isArray(obj)) {
				obj.forEach(function(value, index) {
					obj[index] = traverse(value, schema, schemaPath);
				});
			} else {
				Object.keys(obj).forEach(function(key) {
					obj[key] = traverse(obj[key], schema, schemaPath);
				});
			}
		}

		return obj;
	})(schema, schema, firstSchemaPath);
}

module.exports = exports = express();

exports.use(express.static(path.join(__dirname, 'public')));

exports.set('schemaPath', __dirname + '/schemas');

exports.get('/schemas', (req, res, next) => {
	var schemaPath = req.app.get('schemaPath');

	recursiveReaddir(schemaPath, (err, files) => {
		var filtered;

		if (err) {
			return next(err);
		}

		filtered = files
			.filter(file => (/\.json$/.test(file)))
			.map(file => path.relative(schemaPath, file));

		res.json(filtered);
	});
});

exports.get('/schemas/yaml/*', function(req, res, next) {
	try {
		res.send(YAML.stringify(processSchema(path.join(req.app.get('schemaPath'), req.params[0])), Number.MAX_VALUE, 2));
	} catch(e) {
		next(e);
	}
});

exports.get('/schemas/*', function(req, res, next) {
	try {
		res.send(processSchema(path.join(req.app.get('schemaPath'), req.params[0])));
	} catch(e) {
		next(e);
	}
});

exports.start = (callback) => {
	var server = exports.listen(exports.get('port') || 3000, exports.get('hostname') || 'localhost', (err) => {
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

if (!module.parent) {
	exports.start();
}