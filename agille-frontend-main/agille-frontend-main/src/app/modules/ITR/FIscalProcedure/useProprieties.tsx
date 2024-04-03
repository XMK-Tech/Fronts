import {useEffect, useState} from 'react'
import {getApiPropriety, selectApiPropriety} from '../../../services/FiscalProcedureApi'

export function useProprieties(): {
  proprieties: {
    value: string
    label: string
  }[]
} {
  const [proprietyList, setProprietyList] = useState<any | null>(null)
  const propriety = () => {
    return selectApiPropriety().then((res) => {
      setProprietyList(res.data)
    })
  }
  useEffect(() => {
    propriety()
  }, [])
  return {proprieties: proprietyList?.map(proprietyToSelect) ?? []}
}
export const proprietyToSelect = (p: any): {value: string; label: string} => ({
  value: p.id,
  label: `${p.cibNumber ? p.cibNumber + ' - ' : ''} ${p.displayName ?? p.name ?? ''}`,
})
