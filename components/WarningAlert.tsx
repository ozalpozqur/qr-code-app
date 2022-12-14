import { RiAlarmWarningLine } from 'react-icons/ri';
import { ReactNode } from 'react';

interface Props {
	title: ReactNode;
	children: ReactNode;
}
export default function WarningAlert({ title, children }: Props) {
	return (
		<div className="bg-amber-600 flex gap-4 rounded text-white space-y-1 p-3 w-full">
			<div className="flex items-center">
				<RiAlarmWarningLine size={40} />
			</div>
			<div>
				<p className="text-[18px] sm:text-xl">{title}</p>
				<p className="text-[14px] sm:text-xl">{children}</p>
			</div>
		</div>
	);
}
