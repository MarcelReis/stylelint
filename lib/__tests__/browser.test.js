'use strict';

const configBlockNoEmpty = require('./fixtures/config-block-no-empty');
// const path = require('path');
// const replaceBackslashes = require('../testUtils/replaceBackslashes');
const browser = require('../browser');
const lint = browser.lint;

// const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with input css', () => {
	return lint({
		code: 'a {}',
		config: configBlockNoEmpty,
	}).then((linted) => {
		expect(typeof linted.output).toBe('string');
		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

// it('standalone without input css and file(s) should throw error', () => {
// 	const expectedError = new Error(
// 		'You must pass stylelint a `files` glob or a `code` string, though not both',
// 	);

// 	expect(() => standalone({ config: configBlockNoEmpty })).toThrow(expectedError);
// });

// it('standalone with non-existent-file and allowEmptyInput enabled quietly exits', () => {
// 	return standalone({
// 		files: `${fixturesPath}/non-existent-file.css`,
// 		config: configBlockNoEmpty,
// 		allowEmptyInput: true,
// 	}).then((linted) => {
// 		expect(typeof linted.output).toBe('string');
// 		expect(linted.results).toHaveLength(0);
// 		expect(linted.errored).toBe(false);
// 		expect(linted.output).toBe('[]');
// 	});
// });

// describe('standalone passing code with syntax error', () => {
// 	let results;

// 	beforeEach(() => {
// 		return standalone({
// 			code: "a { color: 'red; }",
// 			config: { rules: { 'block-no-empty': true } },
// 		}).then((data) => (results = data.results));
// 	});

// 	it('<input css 1> as source', () => {
// 		expect(results[0].source).toBe('<input css 1>');
// 	});

// 	it('empty deprecations', () => {
// 		expect(results[0].deprecations).toHaveLength(0);
// 	});

// 	it('empty invalidOptionWarnings', () => {
// 		expect(results[0].invalidOptionWarnings).toHaveLength(0);
// 	});

// 	it('empty parseError', () => {
// 		expect(results[0].parseErrors).toHaveLength(0);
// 	});

// 	it('error registered', () => {
// 		expect(results[0].errored).toBeTruthy();
// 	});

// 	it('syntax error rule is CssSyntaxError', () => {
// 		expect(results[0].warnings).toHaveLength(1);
// 		expect(results[0].warnings[0].rule).toBe('CssSyntaxError');
// 	});

// 	it('syntax error severity is error', () => {
// 		expect(results[0].warnings[0].severity).toBe('error');
// 	});

// 	it('(CssSyntaxError) in warning text', () => {
// 		expect(results[0].warnings[0].text).toContain(' (CssSyntaxError)');
// 	});
// });

// it('syntax error sets errored to true', () => {
// 	return standalone({
// 		code: "a { color: 'red; }",
// 		config: { rules: { 'block-no-empty': true } },
// 	}).then((linted) => {
// 		expect(linted.errored).toBe(true);
// 	});
// });

// it('error `Cannot parse selector` sets errored to true', () => {
// 	return standalone({
// 		code: "data-something='true'] { }",
// 		config: { rules: { 'selector-type-no-unknown': true } },
// 	}).then((linted) => {
// 		expect(linted.errored).toBe(true);
// 	});
// });

// it('configuration error sets errored to true', () => {
// 	return standalone({
// 		code: "a { color: 'red'; }",
// 		config: { rules: { 'block-no-empty': 'wahoo' } },
// 	}).then((linted) => {
// 		expect(linted.errored).toBe(true);
// 	});
// });

// it('unknown syntax option', () => {
// 	return standalone({
// 		syntax: 'unknown',
// 		code: '',
// 		config: { rules: { 'block-no-empty': 'wahoo' } },
// 	})
// 		.then(() => {
// 			throw new Error('should not have succeeded');
// 		})
// 		.catch((err) => {
// 			expect(err.message).toBe(
// 				'You must use a valid syntax option, either: css, css-in-js, html, less, markdown, sass, scss or sugarss',
// 			);
// 		});
// });

// it('unknown custom syntax option', () => {
// 	return standalone({
// 		customSyntax: 'unknown-module',
// 		code: '',
// 		config: { rules: { 'block-no-empty': 'wahoo' } },
// 	})
// 		.then(() => {
// 			throw new Error('should not have succeeded');
// 		})
// 		.catch((err) => {
// 			expect(err.message).toBe('Cannot resolve custom syntax module unknown-module');
// 		});
// });

// it('unknown formatter option', () => {
// 	return standalone({
// 		formatter: 'unknown',
// 		code: '',
// 		config: { rules: { 'block-no-empty': 'wahoo' } },
// 	})
// 		.then(() => {
// 			throw new Error('should not have succeeded');
// 		})
// 		.catch((err) => {
// 			expect(err.message.startsWith('You must use a valid formatter option')).toBe(true);
// 		});
// });

// describe('nonexistent codeFilename with loaded config', () => {
// 	let actualCwd;

// 	beforeAll(() => {
// 		actualCwd = process.cwd();
// 		process.chdir(path.join(__dirname, './fixtures/getConfigForFile/a/b'));
// 	});

// 	afterAll(() => {
// 		process.chdir(actualCwd);
// 	});

// 	it('does not cause error', () => {
// 		return expect(() =>
// 			standalone({
// 				code: 'a {}',
// 				codeFilename: 'does-not-exist.css',
// 			}),
// 		).not.toThrow();
// 	});

// 	it('does load config from process.cwd', () => {
// 		return standalone({
// 			code: 'a {}',
// 			codeFilename: 'does-not-exist.css',
// 		}).then((linted) => {
// 			expect(linted.results[0].warnings).toHaveLength(1);
// 		});
// 	});
// });

// describe('existing codeFilename for nested config detection', () => {
// 	let actualCwd;

// 	beforeAll(() => {
// 		actualCwd = process.cwd();
// 		process.chdir(path.join(__dirname, './fixtures/getConfigForFile'));
// 	});

// 	afterAll(() => {
// 		process.chdir(actualCwd);
// 	});

// 	it('loads config from a nested directory', () => {
// 		return standalone({
// 			code: 'a {}',
// 			codeFilename: 'a/b/foo.css',
// 		}).then((linted) => {
// 			expect(linted.results[0].warnings).toHaveLength(1);
// 		});
// 	});
// });
