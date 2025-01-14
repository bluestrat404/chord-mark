jest.mock('../../../src/parser/parseChord');
jest.mock('../../../src/renderer/helpers/getChordSymbol');

import parseChord from '../../../src/parser/parseChord';
import parseChordLine from '../../../src/parser/parseChordLine';
import getChordSymbol from '../../../src/renderer/helpers/getChordSymbol';
import parseTimeSignature from '../../../src/parser/parseTimeSignature';

import IncorrectBeatCountException from '../../../src/parser/exceptions/IncorrectBeatCountException';
import InvalidChordRepetitionException from '../../../src/parser/exceptions/InvalidChordRepetitionException';

import { forEachChordInChordLine } from '../../../src/parser/helper/songs';

describe('parseChordLine', () => {
	test('Module', () => {
		expect(parseChordLine).toBeInstanceOf(Function);
	});
});

const ts3_4 = parseTimeSignature('3/4');
const ts4_4 = parseTimeSignature('4/4');
const ts5_4 = parseTimeSignature('5/4');
const ts3_8 = parseTimeSignature('3/8');

parseChord.mockImplementation((chordString) => ({ symbol: chordString }));
getChordSymbol.mockImplementation((chordDef) => chordDef.symbol);

describe.each([
	[
		'1 bar / 1 chord / 4/4',
		'Cm',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm',
							model: { symbol: 'Cm' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'1 bar / 2 chords / 4/4',
		'Cm.. F..',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm..',
							model: { symbol: 'Cm' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'F..',
							model: { symbol: 'F' },
							duration: 2,
							beat: 3,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'1 bar / 3 chords / 4/4',
		'Cm.. F. G.',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm..',
							model: { symbol: 'Cm' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 3,
						},
						{
							string: 'G.',
							model: { symbol: 'G' },
							duration: 1,
							beat: 4,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
			],
		},
	],

	[
		'1 bar / 4 chords / 4/4',
		'Cm. Em7. F. G.',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm.',
							model: { symbol: 'Cm' },
							duration: 1,
							beat: 1,
						},
						{
							string: 'Em7.',
							model: { symbol: 'Em7' },
							duration: 1,
							beat: 2,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 3,
						},
						{
							string: 'G.',
							model: { symbol: 'G' },
							duration: 1,
							beat: 4,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'2 bars / 2 chords / 4/4',
		'C F',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'F',
							model: { symbol: 'F' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'2 bars / 3 chords / 4/4',
		'C F.. G..',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'F..',
							model: { symbol: 'F' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'G..',
							model: { symbol: 'G' },
							duration: 2,
							beat: 3,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'2 bars / 4 chords / 4/4',
		'C... Em7. F. G...',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C...',
							model: { symbol: 'C' },
							duration: 3,
							beat: 1,
						},
						{
							string: 'Em7.',
							model: { symbol: 'Em7' },
							duration: 1,
							beat: 4,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
				{
					allChords: [
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 1,
						},
						{
							string: 'G...',
							model: { symbol: 'G' },
							duration: 3,
							beat: 2,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
			],
		},
	],

	[
		'3 bars / 4 chords / 4/4',
		'C Em7. F... G',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'Em7.',
							model: { symbol: 'Em7' },
							duration: 1,
							beat: 1,
						},
						{
							string: 'F...',
							model: { symbol: 'F' },
							duration: 3,
							beat: 2,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
				{
					allChords: [
						{
							string: 'G',
							model: { symbol: 'G' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'1 bar / 1 chord / 3/4',
		'C',
		ts3_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 3,
							beat: 1,
						},
					],
					timeSignature: ts3_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'1 bar / 2 chords / 3/4',
		'Cm. F..',
		ts3_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm.',
							model: { symbol: 'Cm' },
							duration: 1,
							beat: 1,
						},
						{
							string: 'F..',
							model: { symbol: 'F' },
							duration: 2,
							beat: 2,
						},
					],
					timeSignature: ts3_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
			],
		},
	],

	[
		'1 bar / 2 chords / 3/4',
		'Cm.. F.',
		ts3_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm..',
							model: { symbol: 'Cm' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 3,
						},
					],
					timeSignature: ts3_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
			],
		},
	],

	[
		'1 bar / 3 chords / 3/4',
		'Cm. F. G.',
		ts3_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm.',
							model: { symbol: 'Cm' },
							duration: 1,
							beat: 1,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 2,
						},
						{
							string: 'G.',
							model: { symbol: 'G' },
							duration: 1,
							beat: 3,
						},
					],
					timeSignature: ts3_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'3/8 bar',
		'Cm F G.',
		ts3_8,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm',
							model: { symbol: 'Cm' },
							duration: 1,
							beat: 1,
						},
					],
					timeSignature: ts3_8,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'F',
							model: { symbol: 'F' },
							duration: 1,
							beat: 1,
						},
					],
					timeSignature: ts3_8,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'G.',
							model: { symbol: 'G' },
							duration: 1,
							beat: 1,
						},
					],
					timeSignature: ts3_8,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'trim end spaces',
		'Cm ',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm',
							model: { symbol: 'Cm' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'trim start spaces',
		' Cm',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm',
							model: { symbol: 'Cm' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'trim start and end spaces',
		'   Cm   ',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'Cm',
							model: { symbol: 'Cm' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'handle multiple spaces between chords',
		'C..     B..',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C..',
							model: { symbol: 'C' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'B..',
							model: { symbol: 'B' },
							duration: 2,
							beat: 3,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'handle the "no-chord" symbol',
		'C NC B.. NC.. D',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{ string: 'NC', model: 'NC', duration: 4, beat: 1 },
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'B..',
							model: { symbol: 'B' },
							duration: 2,
							beat: 1,
						},
						{ string: 'NC..', model: 'NC', duration: 2, beat: 3 },
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'D',
							model: { symbol: 'D' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'flag repeated bars, single chord per bar',
		'C % D %',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'C',
							model: { symbol: 'C' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: true,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'D',
							model: { symbol: 'D' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'D',
							model: { symbol: 'D' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: true,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],

	[
		'flag repeated bars, multiple chords per bar',
		'C.. Am. F. %',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C..',
							model: { symbol: 'C' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'Am.',
							model: { symbol: 'Am' },
							duration: 1,
							beat: 3,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 4,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: true,
				},
				{
					allChords: [
						{
							string: 'C..',
							model: { symbol: 'C' },
							duration: 2,
							beat: 1,
						},
						{
							string: 'Am.',
							model: { symbol: 'Am' },
							duration: 1,
							beat: 3,
						},
						{
							string: 'F.',
							model: { symbol: 'F' },
							duration: 1,
							beat: 4,
						},
					],
					timeSignature: ts4_4,
					isRepeated: true,
					hasUnevenChordsDurations: true,
				},
			],
		},
	],

	[
		'spaces in chord symbol',
		'C(add b9) F(add #9)',
		ts4_4,
		{
			allBars: [
				{
					allChords: [
						{
							string: 'C(addb9)',
							model: { symbol: 'C(addb9)' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
				{
					allChords: [
						{
							string: 'F(add#9)',
							model: { symbol: 'F(add#9)' },
							duration: 4,
							beat: 1,
						},
					],
					timeSignature: ts4_4,
					isRepeated: false,
					hasUnevenChordsDurations: false,
				},
			],
		},
	],
])('%s: %s', (title, input, timeSignature, expected) => {
	test('is correctly parsed', () => {
		const options = { timeSignature };
		const parsed = parseChordLine(input, options);

		expect(parsed).toEqual(expected);
	});
});

describe.each([
	['1 chord / 1 beat / 4/4', 'Cm.', 'Cm.', 1, 1, ts4_4],
	['1 chord / 2 beats / 4/4', 'Cm..', 'Cm..', 2, 2, ts4_4],
	['1 chord / 3 beats / 4/4', 'Cm...', 'Cm...', 3, 3, ts4_4],
	['1 chord / 5 beats / 4/4', 'Cm.....', 'Cm.....', 5, 5, ts4_4],
	['1 chord / 6 beats / 4/4', 'Cm......', 'Cm......', 6, 6, ts4_4],
	['1 chord / 7 beats / 4/4', 'Cm.......', 'Cm.......', 7, 7, ts4_4],
	['2 chords / 3 beats / 4/4', 'Cm. D..', 'D..', 2, 3, ts4_4],
	['2 chords / 5 beats / 4/4', 'Cm... D..', 'D..', 2, 5, ts4_4],
	['2 chords / 6 beats / 4/4', 'Cm... D...', 'D...', 3, 6, ts4_4],
	['2 chords / 7 beats / 4/4', 'Cm... D', 'D', 4, 7, ts4_4],
	['3 chords / 3 beats / 4/4', 'C. D. E.', 'E.', 1, 3, ts4_4],
	['3 chords / 5 beats / 4/4', 'C. D.. E..', 'E..', 2, 5, ts4_4],

	['1 chords / 4 beats / 5/4', 'C....', 'C....', 4, 4, ts5_4],
	['2 chords / 4 beats / 5/4', 'C.. D..', 'D..', 2, 4, ts5_4],
	['3 chords / 6 beats / 5/4', 'C.. D.. E..', 'E..', 2, 6, ts5_4],
	['3 chords / 7 beats / 5/4', 'C.. D... E..', 'E..', 2, 2, ts5_4],
	['3 chords / 8 beats / 5/4', 'C... D... E..', 'D...', 3, 6, ts5_4],
	['3 chords / 9 beats / 5/4', 'C... D E.', 'D', 5, 8, ts5_4],
])(
	'Throw on %s: %s',
	(title, input, string, duration, currentBeatCount, timeSignature) => {
		const throwingFn = () => {
			parseChordLine(input, { timeSignature });
		};

		test('Throw InvalidChordRepetitionException', () => {
			expect(throwingFn).toThrow(IncorrectBeatCountException);
		});

		test('Add correct properties to exception', () => {
			try {
				throwingFn();
				expect(false).toBeTruthy();
			} catch (e) {
				expect(e.name).toBe('IncorrectBeatCountException');
				expect(e.string).toBe(string);
				expect(e.duration).toBe(duration);
				expect(e.currentBeatCount).toBe(currentBeatCount);
				expect(e.beatCount).toBe(timeSignature.beatCount);
			}
		});
	}
);

describe.each([
	['A. A...', 'A...'],
	['A.. A..', 'A..'],
	['A... A.', 'A.'],
	['A... B. C.. C. F.', 'C.'],
	['A... B. F... F.', 'F.'],
])('Throw if repeated chord in a bar: %s', (input, string) => {
	const throwingFn = () => {
		parseChordLine(input);
	};

	test('Throw InvalidChordRepetitionException', () => {
		expect(throwingFn).toThrow(InvalidChordRepetitionException);
	});

	test('Add correct properties to exception', () => {
		try {
			throwingFn();
			expect(false).toBeTruthy();
		} catch (e) {
			expect(e.name).toBe('InvalidChordRepetitionException');
			expect(e.string).toBe(string);
		}
	});
});

describe.each([
	['A %', 'A A', [0, 1]],
	['A % % %', 'A A A A', [0, 1, 1, 1]],
	['A % B %', 'A A B B', [0, 1, 0, 1]],
	['A B C D % %', 'A B C D D D', [0, 0, 0, 0, 1, 1]],
	['A B % C D %', 'A B B C D D', [0, 0, 1, 0, 0, 1]],
	['A.. B.. C... D. % %', 'A B C D C D C D', [0, 0, 1, 1]],

	['A %%%', 'A A A A', [0, 1, 1, 1]],
	['A %% %', 'A A A A', [0, 1, 1, 1]],
	['A % %% %', 'A A A A A', [0, 1, 1, 1, 1]],
	['A % %% B % %%', 'A A A A B B B B', [0, 1, 1, 1, 0, 1, 1, 1]],
])('barRepeat: %s', (input, expected, repeatFlags) => {
	test('should correctly repeat previous bar', () => {
		const parsed = parseChordLine(input);
		const parsedArray = [];
		forEachChordInChordLine(parsed, (chord) => {
			parsedArray.push(chord.model.symbol);
		});

		expect(parsedArray.join(' ')).toEqual(expected);
	});

	test('should flag repeated bars', () => {
		const parsed = parseChordLine(input);

		expect.assertions(parsed.allBars.length);

		parsed.allBars.forEach((bar, i) => {
			expect(bar.isRepeated).toBe(!!repeatFlags[i]);
		});
	});
});

describe.each([['% A'], ['%% A'], [' % A'], ['	% A']])(
	'Throw if line starts with repeatBar symbol: %s',
	(input) => {
		const throwingFn = () => {
			parseChordLine(input);
		};

		test('Throw Error', () => {
			expect(throwingFn).toThrow(Error);
			expect(throwingFn).toThrow(
				'A chord line cannot start with the barRepeat symbol'
			);
		});
	}
);
