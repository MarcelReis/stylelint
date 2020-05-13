'use strict';

const blockNoEmpty = require('../rules/block-no-empty');
const browser = require('../browser');
const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
const lint = browser.lint;

jest.mock('../rules/block-no-empty');

blockNoEmpty.mockImplementation(() => {
	return (root, result) => {
		result.warn('Some deprecation', {
			stylelintType: 'deprecation',
		});
	};
});

describe('browser with deprecations', () => {
	it('works', async () => {
		const result = await lint({
			code: 'a {}',
			config: configBlockNoEmpty,
		});

		expect(result.output).toContain('Some deprecation');
		expect(result.results).toHaveLength(1);
		expect(result.results[0].deprecations).toHaveLength(1);
		expect(result.results[0].deprecations[0].text).toBe('Some deprecation');
	});
});
