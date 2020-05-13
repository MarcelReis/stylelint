'use strict';

const { promisify } = require('util');

const browser = require('../browser');
const fs = require('fs');
const path = require('path');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const stringFormatter = require('../formatters/stringFormatter');
const stripAnsi = require('strip-ansi');

const lint = browser.lint;
const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));

it('standalone with css syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return lint({
		config,
		code: 'a {}',
		syntax: 'css',
		// formatter: stringFormatter,
	}).then((linted) => {
		const parsedOutput = JSON.parse(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(parsedOutput[0].warnings[0]).toMatchObject({
			column: 3,
			line: 1,
			rule: 'block-no-empty',
		});
	});
});

it('browser with scss syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return lint({
		config,
		code: '$foo: bar; // foo;\nb {}',
		customSyntax: require('../syntaxes/syntax-scss'),
		// formatter: stringFormatter,
	}).then((linted) => {
		const parsedOutput = JSON.parse(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(parsedOutput[0].warnings[0]).toMatchObject({
			column: 3,
			line: 2,
			rule: 'block-no-empty',
		});
	});
});

it('browser with sugarss syntax', () => {
	const config = {
		rules: {
			'length-zero-no-unit': true,
		},
	};

	return lint({
		config,
		code: '.one\n  color: black\n  top: 0px\n.two',
		customSyntax: require('../syntaxes/syntax-sugarss'),
		// formatter: stringFormatter,
	}).then((linted) => {
		const parsedOutput = JSON.parse(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(parsedOutput[0].warnings[0]).toMatchObject({
			column: 9,
			line: 3,
			rule: 'length-zero-no-unit',
		});
	});
});

it('browser with Less syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return lint({
		config,
		code: '@foo: bar; // foo;\nb {}',
		customSyntax: require('../syntaxes/syntax-less'),
		// formatter: stringFormatter,
	}).then((linted) => {
		const parsedOutput = JSON.parse(linted.output);

		expect(typeof linted.output).toBe('string');
		expect(parsedOutput[0].warnings[0]).toMatchObject({
			column: 3,
			line: 2,
			rule: 'block-no-empty',
		});
	});
});

// TODO: read in fixtures and run individual tests on the string content of each fixture file
it.skip('browser with postcss-html syntax', () => {
	const config = {
		rules: {
			'no-empty-source': true,
			'comment-empty-line-before': 'always',
			'rule-empty-line-before': [
				'always',
				{
					ignore: ['inside-block'],
				},
			],
			'at-rule-empty-line-before': [
				'always',
				{
					except: ['inside-block'],
				},
			],
		},
	};

	return lint({
		config,
		customSyntax: require('../syntaxes/syntax-html'),
		files: [
			`${fixturesPath}/at-rule-empty-line-before.html`,
			`${fixturesPath}/comment-empty-line-before.html`,
			`${fixturesPath}/no-empty-source.html`,
			`${fixturesPath}/rule-empty-line-before.html`,
		],
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(4);

		const atRuleEmptyLineBeforeResult = results.find((r) =>
			/[/\\]at-rule-empty-line-before\.html$/.test(r.source),
		);

		expect(atRuleEmptyLineBeforeResult.errored).toBeFalsy();
		expect(atRuleEmptyLineBeforeResult.warnings).toHaveLength(0);

		const commentEmptyLineBeforeResult = results.find((r) =>
			/[/\\]comment-empty-line-before\.html$/.test(r.source),
		);

		expect(commentEmptyLineBeforeResult.errored).toBeFalsy();
		expect(commentEmptyLineBeforeResult.warnings).toHaveLength(0);

		const noEmptySourceResult = results.find((r) => /[/\\]no-empty-source\.html$/.test(r.source));

		expect(noEmptySourceResult.errored).toBeFalsy();
		expect(noEmptySourceResult.warnings).toHaveLength(0);

		const ruleEmptyLineBeforeResult = results.find((r) =>
			/[/\\]rule-empty-line-before\.html$/.test(r.source),
		);

		expect(ruleEmptyLineBeforeResult.errored).toBe(true);
		expect(ruleEmptyLineBeforeResult.warnings).toHaveLength(1);
		expect(ruleEmptyLineBeforeResult.warnings[0].line).toBe(8);
		expect(ruleEmptyLineBeforeResult.warnings[0].rule).toBe('rule-empty-line-before');
	});
});

// TODO: write these tests
describe.skip('browser with no syntax set', () => {});

it.skip('standalone with postcss-safe-parser', () => {
	return standalone({
		files: `${fixturesPath}/syntax_error.*`,
		config: {
			rules: {},
		},
		fix: true,
	}).then((data) => {
		const results = data.results;

		expect(results).toHaveLength(6);

		const safeParserExtensionsTest = /\.(css|pcss|postcss)$/i;

		results
			.filter((result) => !safeParserExtensionsTest.test(result.source))
			.forEach((result) => {
				expect(result.warnings).toHaveLength(1);

				const error = result.warnings[0];

				expect(error.line).toBe(1);
				expect(error.column).toBe(1);
				expect(error.rule).toBe('CssSyntaxError');
				expect(error.severity).toBe('error');
			});

		return Promise.all(
			results
				.filter((result) => safeParserExtensionsTest.test(result.source))
				.map((result) => {
					const root = result._postcssResult.root;

					expect(result.errored).toBeFalsy();
					expect(result.warnings).toHaveLength(0);
					expect(root.toString()).not.toBe(root.source.input.css);

					return promisify(fs.writeFile)(root.source.input.file, root.source.input.css);
				}),
		);
	});
});

it.skip('standalone with path to custom parser', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: `${fixturesPath}/custom-parser`,
		code: '.foo { width: 200px }\n.bar {',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(6);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it.skip('standalone with path to custom syntax', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		customSyntax: `${fixturesPath}/custom-syntax`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it.skip('standalone should use customSyntax when both customSyntax and syntax are set', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	return standalone({
		config,
		syntax: 'less',
		customSyntax: `${fixturesPath}/custom-syntax`,
		code: '$foo: bar; // foo;\nb {}',
		formatter: stringFormatter,
	}).then((linted) => {
		const results = linted.results;

		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].line).toBe(2);
		expect(results[0].warnings[0].column).toBe(3);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});
