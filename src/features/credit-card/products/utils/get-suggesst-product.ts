/* eslint-disable @typescript-eslint/no-unused-vars */
import { products } from '@/features/credit-card/products/constants/products.constant'

export const getSuggestProducts = (
	uid: string,
	client: {
		income: string
		demands: string[]
		city: string
	}
) => {
	const income = parseInt(client.income.split('.').join(''))

	return products(uid).filter(product => {
		const isCityMatch =
			product.condition.cities === 'all' ||
			product.condition.cities.includes(client.city)

		const isIncomeMatch = product.condition.income <= income

		const isDemandsMatch = client.demands.includes(product.condition.demands)

		return isCityMatch && isIncomeMatch && isDemandsMatch
	})
}
