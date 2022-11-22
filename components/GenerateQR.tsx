import { SpinnerCircular } from 'spinners-react';
import { QRCodeSVG } from 'qrcode.react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { download, svgToDataURL } from '../helpers';
import WarningAlert from './WarningAlert';
import axios from '../libs/axios';
import ErrorAlert from './ErrorAlert';

const isServer = typeof window === 'undefined';

interface GenerateQRProps {
	appId: string | null;
	appURL: string;
	code: string | null;
}
export default function GenerateQR({ appId, appURL, code }: GenerateQRProps) {
	const [value, setValue] = useState<null | string>(
		code && appId ? (code === 'success' ? generateQRValue(appId) : null) : null
	);
	const [loading, setLoading] = useState(false);
	const input = useRef<HTMLInputElement>(null);
	const [hasAlreadyWinError, setHasAlreadyWinError] = useState(code ? code === 'email_already_registered' : false);
	const [hasNotFoundError, setHasNotFoundError] = useState(code ? code === 'not_found' : false);

	async function generateQR() {
		if (!input.current) return;
		setValue(null);
		setLoading(true);
		setHasAlreadyWinError(false);

		const {
			data: { code },
		} = await axios.post('/api/add-user', { appId: input.current.value });

		if (code === 'email_already_registered') {
			setHasAlreadyWinError(true);
		} else if (code === 'not_found') {
			setHasNotFoundError(true);
		} else {
			setValue(generateQRValue(input.current.value));
			input.current.value = '';
			input.current.blur();
		}
		setLoading(false);
	}

	async function submitHandler(e: FormEvent) {
		e.preventDefault();
		generateQR();
	}
	function generateQRValue(appId: string) {
		const url = new URL(appURL ?? window.location.href);
		return `${url.origin}/read-qr/${appId}`;
	}

	return (
		<>
			<form onSubmit={submitHandler} className="w-full items-center flex gap-1 h-[50px]">
				<input
					className="border transition !border-gray-500 px-3 h-full text-base sm:text-lg md:text-2xl !outline-none ring-2 rounded ring-transparent focus:ring-black ring-offset-2 flex-1"
					type="text"
					ref={input}
					maxLength={24}
					minLength={24}
					required
					placeholder="Altogic APP ID'nizi giriniz"
				/>
				<button
					disabled={loading}
					type="submit"
					className="shrink-0 border h-full overflow-hidden relative transition border-gray-500 px-3 h-full ring-2 rounded ring-transparent outline-none focus:active:ring-black active:ring-black ring-offset-2"
				>
					QR Oluştur
					{loading && (
						<span className="absolute inset-0 flex items-center justify-center bg-white/80">
							<SpinnerCircular secondaryColor="#b5b5b5" className="h-[40px]" enabled />
						</span>
					)}
				</button>
			</form>
			<div className="flex flex-col gap-3 sm:gap-6 items-center justify-center">
				{hasAlreadyWinError && (
					<WarningAlert
						title={
							<>
								Bu <strong>APP ID</strong> ile daha önceden bir <strong>SWAG KIT</strong> kazandınız.
							</>
						}
					>
						Lütfen başka bir <strong>APP ID</strong> ile tekrar deneyiniz veya SWAG KIT&apos;inizi teslim
						almak için standımıza uğrayınız.
					</WarningAlert>
				)}
				{hasNotFoundError && (
					<ErrorAlert
						title={
							<>
								Bu <strong>APP ID</strong> sistemimizde kayıtlı değildir.
							</>
						}
					>
						Lütfen başka bir <strong>APP ID</strong> ile tekrar deneyiniz.
					</ErrorAlert>
				)}
				{value && (
					<>
						<div className="bg-green-600 w-full p-3 text-white rounded divide-y divide-white/30">
							<h3 className="text-xl sm:text-2xl mb-1">QR Kodunuz Oluşturulmuştur.</h3>
							<div className="text-base sm:text-lg text-justify pt-1">
								Lütfen QR kodunuzu ekran görüntüsü alarak veya aşağıdaki indirme butonuna tıklayarak
								kaydediniz. Aksi takdirde QR kodunuz silinecektir ve tekrardan oluşturulamayacaktır.
							</div>
						</div>
						<QRCodeSVG size={1024} id="QRCode" className="w-full h-full md:w-[512px]" value={value} />
						<button
							className="w-full border min-h-[50px] transition border-gray-500 px-3 ring-2 rounded ring-transparent outline-none focus:active:ring-black active:ring-black ring-offset-2"
							onClick={() => download('#QRCode', 'altogic-qrcode.png')}
						>
							QR Kodunu İndir
						</button>
						{!isServer && 'share' in navigator && (
							<button
								className="w-full border min-h-[50px] transition border-gray-500 px-3 ring-2 rounded ring-transparent outline-none focus:active:ring-black active:ring-black ring-offset-2"
								onClick={shareImage}
							>
								QR Kodunu Paylaş
							</button>
						)}
					</>
				)}
			</div>
		</>
	);
}

async function shareImage() {
	const svg = document.getElementById('QRCode') as HTMLElement;
	if (!svg || !('share' in navigator)) return;
	const url = await svgToDataURL(svg.outerHTML);
	const response = await fetch(url);
	const blob = await response.blob();
	const filesArray = [
		new File([blob], 'altogic-qrcode.png', {
			type: 'image/png',
			lastModified: new Date().getTime(),
		}),
	];
	await navigator.share({
		files: filesArray,
	});
}
