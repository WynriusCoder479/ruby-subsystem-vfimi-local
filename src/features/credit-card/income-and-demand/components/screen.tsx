'use client'

import { useRouter } from 'next/navigation'
import { FC } from 'react'

import FormWrapper from '@/components/common/form-wrapper'
import IncomeAndDemandForm from '@/features/credit-card/income-and-demand/components/form'

interface IncomeAndDemandScreenProps {
	uid: string
}

const IncomeAndDemandScreen: FC<IncomeAndDemandScreenProps> = ({ uid }) => {
	const router = useRouter()

	if (!uid) {
		router.push('/credit-card/non-qualified')
	}

	return (
		<FormWrapper
			title="Thu nhập và Nhu cầu"
			description="Cung cấp thông tin về thu nhập và nhu cầu của bạn sẽ giúp tôi gợi ý sản phẩm phù hợp nhất cho bạn"
		>
			<IncomeAndDemandForm uid={uid} />
		</FormWrapper>
	)
}

export default IncomeAndDemandScreen
