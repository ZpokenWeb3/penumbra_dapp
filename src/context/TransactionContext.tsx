'use client'
import {
	TransactionInfoRequest,
	TransactionInfoResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createContext, useContext, useEffect, useState } from 'react'
import { createViewServiceClient } from '@/lib'
import { useAuth } from './AuthContextProvider'

type StoreState = {
	transactions: TransactionInfoResponse[]
}

const TransactionsContext = createContext<StoreState>({
	transactions: [],
})

export const useTransactions = () => useContext(TransactionsContext)

type Props = {
	children?: React.ReactNode
}

export const TransactionContextProvider = (props: Props) => {
	const auth = useAuth()
	const [transactions, setTransactions] = useState<TransactionInfoResponse[]>(
		[]
	)

	useEffect(() => {
		if (!auth!.walletAddress) return setTransactions([])
		const getTxs = async () => {
			const client = createViewServiceClient()

			const txsRequest = new TransactionInfoRequest({})

			for await (const tx of client.transactionInfo(txsRequest)) {
				setTransactions(state => [tx, ...state])
			}
		}
		getTxs()
	}, [auth.walletAddress])

	return (
		<TransactionsContext.Provider value={{ transactions }}>
			{props.children}
		</TransactionsContext.Provider>
	)
}
