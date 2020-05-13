'use strict';

const browser = require('../browser');
const lint = browser.lint;

it('browser with input css and `maxWarnings`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
		},
	};

	return lint({
		code: 'a {}',
		config,
		maxWarnings: 0,
	}).then((linted) => {
		const maxWarningsExceeded = linted.maxWarningsExceeded;

		expect(typeof maxWarningsExceeded).toBe('object');
		expect(maxWarningsExceeded.maxWarnings).toBe(0);
		expect(maxWarningsExceeded.foundWarnings).toBe(1);
	});
});
