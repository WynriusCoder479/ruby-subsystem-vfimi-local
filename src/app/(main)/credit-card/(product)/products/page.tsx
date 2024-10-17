/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

import { addChooseTimestamp } from '@/actions/client/add-choose'
import { getProducts } from '@/actions/client/suggest-product'
import Footer from '@/components/common/footer'
import { Button } from '@/components/ui/button'

interface ProductsPageProps {
	searchParams: {
		uid: string
	}
}

const ProductsPage: FC<ProductsPageProps> = ({ searchParams: { uid } }) => {
	const router = useRouter()

	if (!uid) {
		router.push('/credit-card/non-qualified')
	}

	const { data: products } = useQuery({
		queryKey: ['products', uid],
		queryFn: async () => await getProducts(uid)
	})

	const { mutate: addTimestamp, isPending } = useMutation({
		mutationFn: async ({
			productCode,
			link
		}: {
			productCode: string
			link: string
		}) => {
			await addChooseTimestamp(uid, productCode)
			return { link }
		},
		onSuccess: ({ link }) => {
			router.push(link)
		}
	})

	return (
		<div className="flex w-[400px] flex-col items-center gap-2">
			{!products ? (
				<div className="flex h-screen w-full items-center justify-center">
					<div className="flex flex-col items-center justify-center gap-4">
						<Loader2 className="size-6 animate-spin" />
						<p>Vui lòng chờ trong giây lát</p>
					</div>
				</div>
			) : (
				<>
					{products.map(product => (
						<div
							key={product.id}
							className="flex h-fit w-96 gap-2 rounded-md border border-foreground/30 bg-background p-2 shadow-md"
						>
							<Image
								src={product.info.image}
								width={397}
								height={629}
								alt={product.info.image}
								className="aspect-[2/3] w-32 overflow-hidden bg-transparent"
							/>
							<div className="flex flex-1 flex-col gap-2">
								<div className="flex flex-1 flex-col justify-between rounded-lg border border-foreground/30 bg-gradient-to-b from-primary/10 to-transparent p-2 text-sm">
									<p className="font-bold">
										Tên thẻ: <span className="font-normal">{product.name}</span>
									</p>
									<p className="font-bold">
										Hạn mức:{' '}
										<span className="font-normal">
											lên đến {product.info.creditLimt} triệu đồng
										</span>
									</p>
									<p className="font-bold">
										Tính năng nổi bật:{' '}
										<span className="font-normal">
											{product.info.specialFeatures}
										</span>
									</p>
								</div>
								<Button
									className="w-full"
									disabled={isPending}
									onClick={() => {
										addTimestamp({
											link: product.link,
											productCode:
												product.group === 'vp' ? 'vpbankcc' : product.id
										})
									}}
								>
									Mở thẻ ngay
								</Button>
							</div>
						</div>
					))}
				</>
			)}
			<Footer />
		</div>
	)
}

export default ProductsPage
