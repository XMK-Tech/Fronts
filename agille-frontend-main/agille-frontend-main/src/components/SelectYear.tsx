import {SelectInput} from './SelectInput'
import {SelectProps} from './RegisterFormModel'
import {number} from 'yup'

type SelectYear = Omit<SelectProps, 'data'>
type DataYears = {
  id: string
  name: string
}

export default function SelectYear(props: SelectYear) {
  function generateYears(initialYear: number) {
    const currentYear = new Date().getFullYear()
    var years = [{id: initialYear.toString(), name: initialYear.toString()}]
    for (var i = initialYear + 1; i <= currentYear; i++) {
      years = [...years, {id: i.toString(), name: i.toString()}]
    }
    return years.map((e: DataYears) => ({id: e.id, name: e.name}))
  }

  return (
    <>
      <SelectInput {...props} data={generateYears(2017)} />
    </>
  )
}
