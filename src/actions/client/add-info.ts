'use server'

import { formatInTimeZone } from 'date-fns-tz'
import { redirect } from 'next/navigation'

import { CommonInfoSchema } from '@/features/credit-card/common-info/schemas/common-info.schema'
import { getSheets } from '@/lib/google-sheets'
import { calculateAge } from '@/lib/utils'

export const addInfo = async (uid: string, client: CommonInfoSchema) => {
	const sheets = await getSheets()

	const clientAge = calculateAge(client.dob as string)

	if (clientAge < 18) return redirect('/credit-card/non-qualified')

	const {
		data: { values }
	} = await sheets.spreadsheets.values.get({
		spreadsheetId: process.env.SHEET_ID,
		range: 'DATA'
	})

	if (!values) {
		throw Error('Internal server error')
	}

	const data = [...values].map(value => {
		if (value[0] !== uid) return value

		const rest = value.splice(0, 4)

		const { fullname, dob, ...restClient } = client

		return [
			...rest,
			'',
			clientAge,
			fullname.toUpperCase(),
			formatInTimeZone(new Date(dob), 'Asia/Ho_Chi_Minh', 'LL/dd/yyyy'),
			...Object.values(restClient)
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

	redirect(`/credit-card/income-and-demand?uid=${uid}`)
}
