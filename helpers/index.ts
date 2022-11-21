import { Canvg } from 'canvg';
// @ts-ignore
import { saveSvgAsPng } from 'save-svg-as-png';
import altogic, { User } from '../libs/altogic';

export async function svgToDataURL(svg: string) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');
	const canvg = Canvg.fromString(ctx, svg);
	canvg.start();
	return canvas.toDataURL();
}
export function download(selector: string, name: string, scale: number = 10) {
	const svg = document.querySelector<HTMLElement>(selector);
	if (!svg) return;
	saveSvgAsPng(svg, name, {
		scale,
	});
}

export async function getUser(userId: string) {
	const { data, errors } = await altogic.db.model('users').filter(`userId == '${userId}'`).getSingle();

	return {
		user: data as User,
		errors,
	};
}
export async function updateUser(userId: string, data: Partial<User>) {
	const { data: user, errors } = await altogic.db.model('users').object(userId).update(data);
	return {
		user: user as User,
		errors,
	};
}
