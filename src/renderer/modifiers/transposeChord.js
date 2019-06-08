import _cloneDeep from 'lodash/cloneDeep';
import _invert from 'lodash/invert';

const notes = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B',
];

const sharpsToFlats = {
	'C#': 'Db',
	'D#': 'Eb',
	'F#': 'Gb',
	'G#': 'Ab',
	'A#': 'Bb',
};

const flatsToSharps = _invert(sharpsToFlats);

function convertToSharp(note) {
	return flatsToSharps[note] || note;
}

function transposeNote(note, value, useFlats) {
	const noteIndex = notes.indexOf(note);
	const transposedIndex = noteIndex + value;

	const octaves = Math.floor(transposedIndex / 12);
	const correctedTransposedIndex = transposedIndex - (octaves * 12);

	const transposed = notes[correctedTransposedIndex];

	return (useFlats)
		? sharpsToFlats[transposed] || transposed
		: transposed;
}

export default function transposeChord(chord, value, useFlats) {
	const transposedChord = _cloneDeep(chord); // check immutability

	const root = transposedChord.formatted.rootNote;
	const bass = transposedChord.formatted.bassNote;

	const rootSharp = convertToSharp(root);
	transposedChord.formatted.rootNote = transposeNote(rootSharp, value, useFlats);

	if (bass) {
		const bassSharp = convertToSharp(bass);
		transposedChord.formatted.bassNote = transposeNote(bassSharp, value, useFlats);
	}

	return transposedChord;
}
