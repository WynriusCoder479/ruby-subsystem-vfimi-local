import { FC } from 'react'

import CommonInfoScreen from '@/features/credit-card/common-info/components/screen'

interface HomePageProps {
	searchParams: {
		uid: string
	}
}

const HomePage: FC<HomePageProps> = ({ searchParams: { uid } }) => {
	return <CommonInfoScreen uid={uid} />
}

export default HomePage
