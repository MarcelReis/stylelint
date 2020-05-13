'use strict';

const browser = require('../browser');
const lint = browser.lint;

it('browser with input css and `reportNeedlessDisables`', () => {
	const config = {
		quiet: true,
		rules: {
			'block-no-empty': true,
			'color-named': 'never',
		},
	};

	return lint({
		code: '/* stylelint-disable color-named */\na {}',
		config,
		reportNeedlessDisables: true,
	}).then((linted) => {
		const needlessDisables = linted.needlessDisables;

		expect(typeof needlessDisables).toBe('object');
		expect(needlessDisables).toHaveLength(1);
		expect(needlessDisables[0].ranges).toHaveLength(1);
		expect(needlessDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});
	});
});
