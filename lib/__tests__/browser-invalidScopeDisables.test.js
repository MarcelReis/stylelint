'use strict';

const browser = require('../browser');
const lint = browser.lint;
const config = {
	quiet: true,
	rules: {
		'block-no-empty': true,
	},
};

it('browser with input css and `reportInvalidScopeDisables`', () => {
	return lint({
		code: '/* stylelint-disable color-named */\na {}',
		config,
		reportInvalidScopeDisables: true,
	}).then((linted) => {
		const invalidScopeDisables = linted.invalidScopeDisables;

		expect(typeof invalidScopeDisables).toBe('object');
		expect(invalidScopeDisables).toHaveLength(1);
		expect(invalidScopeDisables[0].ranges).toHaveLength(1);
		expect(invalidScopeDisables[0].ranges[0]).toEqual({
			start: 1,
			unusedRule: 'color-named',
		});
	});
});
