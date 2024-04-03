import {ValueType} from './schema'

export type ProprietyFormSelectedProps = {
  selected: number
  footer?: React.ReactNode
  initialValues: ValueType
  id: string
  startSave?: (values: ValueType) => Promise<void>
  endSave?: () => void
  onSave?: boolean
  stopLoading: () => void
}
