'use strict';

const blockNoEmpty = require('../rules/block-no-empty');
const configBlockNoEmpty = require('./fixtures/config-block-no-empty');

const browser = require('../browser');
const lint = browser.lint;

jest.mock('../rules/block-no-empty');

blockNoEmpty.mockImplementation(() => {
	return (root, result) => {
		result.warn('Some parseError', {
			stylelintType: 'parseError',
		});
	};
});

test('standalone with deprecations', async () => {
	const data = await lint({
		code: 'a {}',
		config: configBlockNoEmpty,
	});

	expect(data.output).toContain('Some parseError');
	expect(data.results).toHaveLength(1);
	expect(data.results[0].parseErrors).toHaveLength(1);
	expect(data.results[0].parseErrors[0].text).toBe('Some parseError');
});
