import { Canvg } from 'canvg';
// @ts-ignore
import { saveSvgAsPng } from 'save-svg-as-png';

export async function svgToDataURL(svg: string) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');
	const canvg = Canvg.fromString(ctx, svg);
	canvg.start({ scaleWidth: 300, scaleHeight: 300 });
	return canvas.toDataURL();
}
export function download(selector: string, name: string, scale: number = 10) {
	const svg = document.querySelector<HTMLElement>(selector);
	if (!svg) return;
	saveSvgAsPng(svg, name, {
		scale,
	});
}
