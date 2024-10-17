'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { addIncomeAndDemand } from '@/actions/client/add-income-and-demand'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormCombobox from '@/components/ui/form-combobox'
import FormInput from '@/components/ui/form-input'
import FormMultipleCheckbox from '@/components/ui/form-multiple-checkbox'
import { demands } from '@/features/credit-card/income-and-demand/constants/demand.constant'
import { income } from '@/features/credit-card/income-and-demand/constants/income.constant'
import {
	incomeAndDemand,
	IncomeAndDemandSchema
} from '@/features/credit-card/income-and-demand/schemas/income-and-demand.schema'

interface IncomeAndDemandFormProps {
	uid: string
}

const IncomeAndDemandForm: FC<IncomeAndDemandFormProps> = ({ uid }) => {
	const form = useForm<IncomeAndDemandSchema>({
		resolver: zodResolver(incomeAndDemand),
		defaultValues: {
			income: '',
			demands: [],
			otherDemand: ''
		}
	})

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IncomeAndDemandSchema) => {
			await addIncomeAndDemand(uid, values)
		}
	})

	const onSubmit = form.handleSubmit(values => mutate(values))

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<div className="flex flex-col gap-4">
					<FormCombobox
						name="income"
						isLoading={isPending}
						control={form.control}
						form={form}
						initalData=""
						items={income}
						isMessage
						label="Thu nhập cá nhân"
					/>
					<FormMultipleCheckbox
						name="demands"
						isLoading={isPending}
						control={form.control}
						label="Nhu cầu"
						isFormMessage
						items={demands}
					/>
					<FormInput
						name="otherDemand"
						isLoading={isPending}
						control={form.control}
						isFormMessage
						label="Nhu cầu khác"
					/>

					<Button
						type="submit"
						disabled={isPending}
					>
						Tiếp theo
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default IncomeAndDemandForm
