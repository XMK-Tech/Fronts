import {useEffect, useState} from 'react'
import {CustomButton} from '../app/components/CustomButton/CustomButton'
import Table from '../app/components/Table/Table'
import {mapContent} from '../app/components/Table/TableHead'
import {TableRowProps} from '../app/components/Table/TableRow'
import {actions} from '../app/modules/auth'
import {getServiceTypePerson} from '../app/services/PersonApi'

type TableServicesProvidedProps = {
  id: string
  onSubmit: (value: string) => void
}

type Descriptions = {
  id: string
  issRate: number
  issAnnualValue: number
  description: string
  code: string
}

export type ServiceTypePerson = {
  id: string
  name: string
  descriptions: Descriptions[]
}
export default function TableServicesProvided(props: TableServicesProvidedProps) {
  const [data, setData] = useState<ServiceTypePerson[] | null>(null)
  useEffect(() => {
    getServiceTypePerson(props.id).then((res) => {
      setData(res.data)
    })
  }, [props.id])
  const rows = data
    ?.reduce((cur, prev) => {
      return [...cur, ...prev.descriptions]
    }, [] as Descriptions[])

    ?.map((e, i) => ({
      columns: mapContent(
        [
          e.code,
          e.description,
          `${e.issRate}%`,
          <CustomButton
            margin='m-0'
            label='aplicar'
            isLoading={false}
            onSubmit={() => props.onSubmit(e.issRate.toString())}
          ></CustomButton>,
        ],
        'normal'
      ),
    }))

  return (
    <Table
      className='mw-600px'
      headColumns={mapContent(['#', 'SERVIÇO', 'ALÍQUOTA', 'AÇÃO'])}
      rows={rows ?? []}
    ></Table>
  )
}
