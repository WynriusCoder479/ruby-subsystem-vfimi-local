/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { FC, useEffect } from 'react'

import { createClient } from '@/actions/client/add-first'
import { generateRandomSubString } from '@/lib/gen-id'

interface HomePageProps {
	searchParams: {
		code: string
		product: string
	}
}

const HomePage: FC<HomePageProps> = ({ searchParams: { code } }) => {
	const { mutate: createClientMutate, isPending } = useMutation({
		mutationFn: async ({ publisherCode }: { publisherCode: string }) => {
			const uid = generateRandomSubString(12)

			await createClient(uid, publisherCode)
		}
	})

	useEffect(() => {
		createClientMutate({
			publisherCode: code
		})
	}, [])

	if (!isPending) return null

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4">
				<Loader2 className="size-7 animate-spin" />
				<p>Vui lòng chờ trong giây lát</p>
			</div>
		</div>
	)
}

export default HomePage
