'use server'

import { redirect } from 'next/navigation'

import { IncomeAndDemandSchema } from '@/features/credit-card/income-and-demand/schemas/income-and-demand.schema'
import { getSheets } from '@/lib/google-sheets'

export const addIncomeAndDemand = async (
	uid: string,
	incomeAndDemand: IncomeAndDemandSchema
) => {
	const sheets = await getSheets()

	const parseIncome = parseInt(incomeAndDemand.income.split('.').join(''))

	if (parseIncome < 4500000) redirect('/credit-card/non-qualified')

	const {
		data: { values }
	} = await sheets.spreadsheets.values.get({
		spreadsheetId: process.env.SHEET_ID,
		range: 'DATA'
	})

	if (!values) {
		throw Error('Internal server error')
	}

	const dataTransfer = {
		income: parseIncome,
		demands: [...incomeAndDemand.demands, incomeAndDemand.otherDemand].join(',')
	}

	const data = [...values].map(value => {
		if (value[0] !== uid) return value

		const rest = [...value].splice(0, 3)
		const info = [...value].splice(4, 6)

		return [...rest, '', ...info, ...Object.values(dataTransfer)]
	})

	await sheets.spreadsheets.values.update({
		spreadsheetId: process.env.SHEET_ID,
		range: 'DATA',
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: data
		}
	})

	redirect(`/credit-card/products?uid=${uid}`)
}
