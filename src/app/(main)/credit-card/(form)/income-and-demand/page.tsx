import { FC } from 'react'

import IncomeAndDemandScreen from '@/features/credit-card/income-and-demand/components/screen'

interface IncomeAndDemandPageProps {
	searchParams: {
		uid: string
	}
}

const IncomeAndDemandPage: FC<IncomeAndDemandPageProps> = ({
	searchParams: { uid }
}) => {
	return <IncomeAndDemandScreen uid={uid} />
}

export default IncomeAndDemandPage
