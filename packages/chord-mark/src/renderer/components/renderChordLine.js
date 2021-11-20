import chordLineTpl from './tpl/chordLine.hbs';

import renderBarContent from './renderBarContent';
import barSeparatorTpl from './tpl/barSeparator.hbs';
import symbols from '../symbols';

/**
 * @param {ChordLine} chordLineModel
 * @returns {String} rendered html
 */
export default function renderChordLine(chordLineModel) {
	const allBarsRendered = chordLineModel.allBars.map((bar) =>
		renderBarContent(bar)
	);

	const barSeparator = barSeparatorTpl({
		barSeparator: symbols.barSeparator,
	});

	const chordLine =
		barSeparator + allBarsRendered.join(barSeparator) + barSeparator;

	const chordLineOffset = symbols.chordLineOffsetSpacer.repeat(
		chordLineModel.offset || 0
	);

	return chordLineTpl({ chordLineOffset, chordLine });
}