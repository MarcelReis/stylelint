// @ts-nocheck

'use strict';

const _ = require('lodash');
const functionArgumentsSearch = require('../../utils/functionArgumentsSearch');
const getSchemeFromUrl = require('../../utils/getSchemeFromUrl');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'function-url-scheme-whitelist';

const messages = ruleMessages(ruleName, {
	rejected: (scheme) => `Unexpected URL scheme "${scheme}:"`,
});

function rule(whitelist) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: whitelist,
			possible: [_.isString, _.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
				const unspacedUrlString = _.trim(args, ' ');

				if (!isStandardSyntaxUrl(unspacedUrlString)) {
					return;
				}

				const urlString = _.trim(unspacedUrlString, '\'"');
				const scheme = getSchemeFromUrl(urlString);

				if (scheme === null) {
					return;
				}

				if (matchesStringOrRegExp(scheme, whitelist)) {
					return;
				}

				report({
					message: messages.rejected(scheme),
					node: decl,
					index,
					result,
					ruleName,
				});
			});
		});
	};
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
