import alignedSpacer from '../../../../../src/renderer/spacers/chord/aligned';
import parseChordLine from '../../../../../src/parser/parseChordLine';
import getChordSymbol from '../../../../../src/renderer/helpers/getChordSymbol';
import { forEachChordInChordLine } from '../../../../../src/parser/helper/songs';

describe('alignedSpacer', () => {
	test('Module', () => {
		expect(alignedSpacer).toBeInstanceOf(Function);
	});
});

const defaultSpacesAfter = 2;
const emptyBeatSpaces = 1;

describe.each([
	[
		'fills second, third and fourth beat',
		'A',
		[{ 1: 1, 2: 0, 3: 0, 4: 0 }],
		[0],
		[
			defaultSpacesAfter +
				emptyBeatSpaces +
				emptyBeatSpaces +
				emptyBeatSpaces,
		],
	],

	[
		'fills second and fourth beat',
		'A.. D7..',
		[{ 1: 1, 2: 0, 3: 2, 4: 0 }],
		[0, 0, 0],
		[
			defaultSpacesAfter + emptyBeatSpaces,
			defaultSpacesAfter + emptyBeatSpaces,
		],
	],

	[
		'fills second beat',
		'A.. D7. E7.',
		[{ 1: 1, 2: 0, 3: 2, 4: 2 }],
		[0, 0, 0],
		[defaultSpacesAfter + emptyBeatSpaces, defaultSpacesAfter, 0],
	],

	[
		'fills third beat',
		'A. Dmi7.. E7.',
		[{ 1: 1, 2: 4, 3: 0, 4: 2 }],
		[0, 0, 0],
		[defaultSpacesAfter, defaultSpacesAfter + emptyBeatSpaces, 0],
	],

	[
		'fills space within for "full" beats',
		'A. Dmi7.. E7.',
		[{ 1: 3, 2: 6, 3: 0, 4: 3 }],
		[2, 2, 1],
		[defaultSpacesAfter, defaultSpacesAfter + emptyBeatSpaces, 0],
	],

	[
		'fills space within for "empty" beats',
		'A.. D7..',
		[{ 1: 3, 2: 6, 3: 3, 4: 7 }],
		[2, 1],
		[defaultSpacesAfter + 6 + defaultSpacesAfter, defaultSpacesAfter + 7],
	],

	[
		'take chords durations markers into account',
		'A. Dmi7.. E7.',
		[{ 1: 3, 2: 6, 3: 2, 4: 5 }],
		[1, 0, 2],
		[defaultSpacesAfter, defaultSpacesAfter + 2 + defaultSpacesAfter, 0],
		true,
	],

	[
		'DO NOT space last chord if bar separators are displayed',
		'A. B. C. D.',
		[{ 1: 1, 2: 1, 3: 1, 4: 1 }],
		[0, 0, 0, 0],
		[defaultSpacesAfter, defaultSpacesAfter, defaultSpacesAfter, 0],
		undefined,
		true,
	],

	[
		'space last chord if bar separators are NOT displayed',
		'A. B. C. D.',
		[{ 1: 1, 2: 1, 3: 1, 4: 1 }],
		[0, 0, 0, 0],
		[
			defaultSpacesAfter,
			defaultSpacesAfter,
			defaultSpacesAfter,
			defaultSpacesAfter,
		],
		undefined,
		false,
	],
])(
	'Aligned spacer: %s',
	(
		title,
		chordLine,
		maxBeatWidth,
		spacesWithin,
		spacesAfter,
		shouldPrintChordsDuration = false,
		shouldPrintBarSeparators = true
	) => {
		test('Correctly fills .spacesWithin and .spacesAfter properties', () => {
			let parsed = parseChordLine(chordLine);
			parsed = forEachChordInChordLine(
				parsed,
				(chord) => (chord.symbol = getChordSymbol(chord.model))
			);

			parsed.allBars.map((bar) => {
				bar.shouldPrintChordsDuration = !!shouldPrintChordsDuration;
			});

			const spaced = alignedSpacer(
				parsed,
				maxBeatWidth,
				shouldPrintBarSeparators
			);

			let chordIndex = 0;

			spaced.allBars.forEach((bar) => {
				bar.allChords.forEach((chord) => {
					expect(chord).toHaveProperty('spacesWithin');
					expect(chord.spacesWithin).toEqual(
						spacesWithin[chordIndex]
					);

					expect(chord).toHaveProperty('spacesAfter');
					expect(chord.spacesAfter).toEqual(spacesAfter[chordIndex]);

					chordIndex++;
				});
			});
		});
	}
);
