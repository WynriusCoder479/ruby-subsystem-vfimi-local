'use server'

import { formatInTimeZone } from 'date-fns-tz'
import { redirect } from 'next/navigation'

import { getSheets } from '@/lib/google-sheets'

export const addChooseTimestamp = async (uid: string, productCode: string) => {
	const sheets = await getSheets()

	const {
		data: { values }
	} = await sheets.spreadsheets.values.get({
		spreadsheetId: process.env.SHEET_ID,
		range: 'DATA'
	})

	if (!values) {
		throw Error('Internal server error')
	}

	const timestamp = Date.now()

	const data = [...values].map(value => {
		if (value[0] !== uid) return value

		const rest = [...value].splice(0, 3)
		const info = [...value].splice(4, 8)

		return [
			...rest,
			productCode,
			...info,
			formatInTimeZone(
				new Date(timestamp),
				'Asia/Ho_Chi_Minh',
				'QQQ E LL/dd/yyyy - HH:mm:ss'
			)
		]
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
