import { dirname, basename, join } from 'path';

export function processSchema(firstSchemaPath) {
	var schema = require(firstSchemaPath);

	return (function traverse(obj, schema, schemaPath) {
		if (typeof obj === 'object') {
			if ('$ref' in obj) {
				var items = obj.$ref.split('#'),
					fileName = join(dirname(schemaPath), items[0] || basename(schemaPath)),
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
				obj.forEach((value, index) => obj[index] = traverse(value, schema, schemaPath));
			} else {
				Object.keys(obj).forEach(key => obj[key] = traverse(obj[key], schema, schemaPath));
			}
		}

		return obj;
	})(schema, schema, firstSchemaPath);
}
