import {useCallback, useEffect, useState} from 'react'
import {selectPersons, selectPersonsByPropriety} from '../../../../services/PersonApi'

export function useActiveTab(handler: () => void) {
  useEffect(() => {
    handler()
    const eventHandler = function (this: Document, event: Event): void {
      if (!document.hidden) {
        handler()
      }
    }
    document.addEventListener('visibilitychange', eventHandler, false)
    return () => document.removeEventListener('visibilitychange', eventHandler, false)
  }, [handler])
}

export function useProprietaries(proprietyId: string | null = null) {
  const [proprietaries, setProprietaries] = useState<
    {id: string; displayName: string; name: string; document: string; cib: string}[]
  >([])
  const loadData = useCallback(() => {
    if (proprietyId !== null) {
      proprietyId && selectPersonsByPropriety(proprietyId).then((res) => setProprietaries(res.data))
    } else {
      selectPersons().then((res) => setProprietaries(res.data))
    }
  }, [proprietyId])

  useActiveTab(loadData)
  return proprietaries
    ?.map((p) => ({
      id: p.id,
      name: `${p.cib ? p.cib + ' - ' : ''} ${p.displayName || p.name || ''}`,
      document: p.document,
      cib: p.cib,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
