'use strict';

const { lint } = require('../browser');

it('standalone with input css and quiet mode', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': [true, { severity: 'warning' }],
		},
	};

	return lint({ code: 'a {}', config }).then((linted) => {
		expect(linted.results[0].warnings).toEqual([]);
	});
});
