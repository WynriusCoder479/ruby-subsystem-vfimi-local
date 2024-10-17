'use client'

import { useRouter } from 'next/navigation'
import { FC } from 'react'

import FormWrapper from '@/components/common/form-wrapper'
import CommonInfoForm from '@/features/credit-card/common-info/components/form'

interface CommonInfoScreenProps {
	uid: string
}

const CommonInfoScreen: FC<CommonInfoScreenProps> = ({ uid }) => {
	const router = useRouter()

	if (!uid) {
		router.push('/credit-card/non-qualified')
	}

	return (
		<FormWrapper
			title="Thông tin cá nhân"
			description="Hãy cung cấp một số thông tin cá nhân để chúng tôi biết bạn là ai"
		>
			<CommonInfoForm uid={uid} />
		</FormWrapper>
	)
}

export default CommonInfoScreen
