module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},

	'extends': [
		'eslint:recommended'
	],

	'plugins': [
		'import',
		'no-unsanitized'
	],

	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},

	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},

	'rules': {
		'complexity': 				[ 'error', { max: 10 } ],
		'indent': 					[ 'error', 'tab', { 'SwitchCase': 1 } ],
		'linebreak-style': 			[ 'error', 'unix' ],
		'max-depth': 				[ 'error', 4 ],
		'max-len': 					[ 'error', {'code': 150 } ],
		'max-lines': 				[ 'error', { max: 300, skipBlankLines: true, skipComments: true, } ],
		'max-lines-per-function': 	[ 'warn', { max: 50, skipBlankLines: true, skipComments: true, }],
		'max-params': 				[ 'warn', { max: 4 } ],
		'no-shadow': 				[ 'error', { 'builtinGlobals': true } ],
		'quotes': 					[ 'error', 'single' ],
		'semi': 					[ 'error', 'always'],

		'no-restricted-imports': 	[
			'error',
			{
				paths: [
					{
						name: 'lodash',
						message: 'Please do not import lodash as a whole: import individual lodash functions instead.'
					}
				]
			}
		],

		'no-unsanitized/property': 	[ 'error', { escape: { methods: ['escapeHTML'] } } ],
		'no-unsanitized/method': 	[ 'error' ],


		'import/no-restricted-paths': [ 'error',
			{
				'zones': [
					{ 'target': './src/parser', 'from': './src/renderer' },
					{ 'target': './src/parser', 'from': './src/editor' },

					{ 'target': './src/renderer', 'from': './src/editor' },

					{ 'target': './src/editor', 'from': './src/renderer' },
				]
			}
		],
	}
};
