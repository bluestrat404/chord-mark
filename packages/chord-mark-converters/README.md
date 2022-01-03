# ChordMark Converters

A set of converters to convert to and from ChordMark format.

## Installation

```shell
npm install chord-mark-converters
```

## Convert to ChordMark

### From "Chords over lyrics" format

This is the most widely used chord charts format on the web:
chords are displayed above the lyrics where they are supposed to be played.
Websites like Ultimate Guitar use this format.

Use as follow:

```javascript
import { convert2ChordMark } from 'chord-mark-converters';

const input = `[Verse]
  C                 Am
I heard there was a secret chord`;

const chordMark = convert2ChordMark(input, { inputFormat: 'chordsOverLyrics' });
```

### From ChordPro format

```javascript
import { convert2ChordMark } from 'chord-mark-converters';

const input = `I [C]heard there was a [Am]secret chord`;

const chordMark = convert2ChordMark(input, { inputFormat: 'chordPro' });
```

### Result

In both examples above, the following ChordMark string will be generated:

```
#v
C Am
I _heard there was a _secret chord
```

### Auto detect

If you omit the `inputFormat` parameter, `convert2ChordMark` will try to automagically select between `ChordOverLyrics` and `ChordPro`.

```javascript
const chordMark = convert2ChordMark(input);
```

## Convert from ChordMark

### To ChordPro

If you use a digital songbook application such as `MobileSheetPro` or `onSong`, chances are they will allow importing chord charts in the [ChordPro](https://www.chordpro.org) format.
To convert a song in the ChordMark format to ChordPro, proceed as follow:

```javascript
import { chordMarkToChordPro } from 'chord-mark-converters';

const input = `#v
C Am
I _heard there was a _secret chord`;

const parsed = parseSong(input);
const chordPro = renderSong(parsed, {
	customRenderer: chordMarkToChordPro({ showBarSeparators: true }),
});
```

This will produce the following string:

```
{start_of_verse: Verse}
I [|] [C]heard there was a [|] [Am]secret chord [|]
{end_of_verse}
```

### To Ultimate Guitar format

Use this converter if you want to publish ChordMark chord charts to the Ultimate Guitar website.

```javascript
import { parseSong, renderSong } from 'chord-mark';
import { chordMarkToUltimateGuitar } from 'chord-mark-converters';

const input = `#v
C Am
I _heard there was a _secret chord`;

const parsed = parseSong(input);
const ultimateGuitar = renderSong(parsed, {
	customRenderer: chordMarkToUltimateGuitar(),
});
```

This will produce the following string:

```
[Verse]
  |[ch]C[/ch]                |[ch]Am[/ch]         |
I heard there was a secret chord
```