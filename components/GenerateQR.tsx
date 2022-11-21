import { SpinnerCircular } from 'spinners-react';
import { QRCodeSVG } from 'qrcode.react';
// @ts-ignore
import { saveSvgAsPng } from 'save-svg-as-png';
import { FormEvent, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function GenerateQR() {
	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);
	const input = useRef<HTMLInputElement>(null);
	const shareTarget = useRef<HTMLElement>(null);

	const download = () => {
		const svg = document.getElementById('QRCode');
		if (!svg) return;
		saveSvgAsPng(svg, 'altogic-qrcode.png', {
			scale: 10,
		});
	};
	const generateSVG = (e: FormEvent) => {
		e.preventDefault();
		if (!input.current) return;
		setLoading(true);
		configureQRValue(input.current.value);
		input.current.value = '';
		input.current.blur();
		setLoading(false);
	};

	const configureQRValue = (value: string) => {
		const url = new URL(window.location.href);
		console.log(`${url.origin}/read-qr/${value}`);
		setValue(`${url.origin}/read-qr/${value}`);
	};

	async function shareImage() {
		const svg = document.getElementById('QRCode') as HTMLElement;
		if (!svg) return;
		const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
		const filesArray = [
			new File([blob], 'altogic-qrcode.png', {
				type: 'image/png',
				lastModified: new Date().getTime(),
			}),
		];
		const shareData = {
			files: filesArray,
		};
		await navigator.share(shareData);
	}

	return (
		<>
			<form onSubmit={generateSVG} className="w-full items-center flex gap-2 h-[50px]">
				<input
					className="border transition border-gray-500 px-3 h-full text-lg sm:text-2xl outline-none ring-2 rounded ring-transparent focus:ring-black ring-offset-2 flex-1"
					type="text"
					ref={input}
					maxLength={16}
					minLength={16}
					required
					placeholder="APP ID'nizi giriniz"
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
				{value && (
					<>
						<div className="bg-green-600 w-full p-3 text-white rounded">
							<h3 className="text-xl sm:text-2xl">QR Kodunuz Oluşturulmuştur.</h3>
							<div className="border-b border-white/40 h-[1px] my-2" />
							<div className="text-base sm:text-lg text-justify">
								Lütfen QR kodunuzu ekran görüntüsü alarak veya aşağıdaki indirme butonuna tıklayarak
								kaydediniz. Aksi takdirde QR kodunuz silinecektir ve tekrardan oluşturulamayacaktır.
							</div>
						</div>
						<QRCodeSVG id="QRCode" className="w-full h-full md:w-[512px]" value={value} />
						<button
							className="w-full border min-h-[50px] transition border-gray-500 px-3 ring-2 rounded ring-transparent outline-none focus:active:ring-black active:ring-black ring-offset-2"
							onClick={download}
						>
							QR Kodunu İndir
						</button>
						{'share' in navigator && (
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
