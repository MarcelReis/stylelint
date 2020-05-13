'use strict';

const browser = require('../browser');
const lint = browser.lint;
const stripIndent = require('common-tags').stripIndent;

it('outputs fixed code when input is code string', () => {
	return lint({
		code: '  a { color: red; }',
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe('a { color: red; }');
	});
});

it('does not modify shorthand object syntax when autofixing', () => {
	const codeString = `const width = '100px'; const x = <div style={{width}}>Hi</div>`;

	return lint({
		code: codeString,
		customSyntax: require('../syntaxes/syntax-css-in-js'),
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(codeString);
	});
});

it('apply indentation autofix at last', () => {
	return lint({
		code:
			'a {\nbox-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
		config: {
			rules: {
				indentation: 2,
				'value-list-comma-newline-after': 'always',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(
			'a {\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1),\n    0 0 0 1px rgba(0, 0, 0, 0.2),\n    inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
		);
	});
});

it("doesn't fix with stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable */
	a {
		color: red;
	}
	`;

	return lint({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("doesn't fix with scoped stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable indentation */
	a {
		color: red;
	}
	`;

	return lint({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("doesn't fix with multiple scoped stylelint-disable commands", () => {
	const code = `
	/* stylelint-disable indentation, color-hex-length */
	a {
		color: #ffffff;
	}
	`;

	return lint({
		code,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(code);
	});
});

it("the color-hex-length rule doesn't fix with scoped stylelint-disable commands", () => {
	return lint({
		code: stripIndent`
				/* stylelint-disable color-hex-length */
				a {
				color: #ffffff;
				}
				`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(stripIndent`
				/* stylelint-disable color-hex-length */
				a {
				  color: #ffffff;
				}
				`);
	});
});

it("the indentation rule doesn't fix with scoped stylelint-disable commands", () => {
	return lint({
		code: stripIndent`
				/* stylelint-disable indentation */
				a {
				color: #ffffff;
				}
				`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	}).then((result) => {
		expect(result.output).toBe(stripIndent`
				/* stylelint-disable indentation */
				a {
				color: #fff;
				}
				`);
	});
});
