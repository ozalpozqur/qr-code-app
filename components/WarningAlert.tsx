import { RiAlarmWarningLine } from 'react-icons/ri';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}
export default function WarningAlert({ children }: Props) {
	return (
		<div className="bg-amber-600 flex gap-4 rounded text-white space-y-1 p-3 w-full">
			<div className="flex items-center">
				<RiAlarmWarningLine size={40} />
			</div>
			<div>{children}</div>
		</div>
	);
}
