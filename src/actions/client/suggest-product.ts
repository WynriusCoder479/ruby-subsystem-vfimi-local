'use server'

import { redirect } from 'next/navigation'

import { getSuggestProducts } from '@/features/credit-card/products/utils/get-suggesst-product'
import { getSheets } from '@/lib/google-sheets'

export const getProducts = async (uid: string) => {
	const sheets = await getSheets()

	if (!uid) redirect('/credit-card/non-qualified')

	const {
		data: { values }
	} = await sheets.spreadsheets.values.get({
		spreadsheetId: process.env.SHEET_ID,
		range: 'DATA'
	})

	if (!values) {
		throw Error('Internal server error')
	}

	const user = values.find(value => value[0] === uid) as string[]

	const products = getSuggestProducts(uid, {
		city: user[9],
		income: user[10],
		demands: user[11].split(',')
	})

	return products
}
