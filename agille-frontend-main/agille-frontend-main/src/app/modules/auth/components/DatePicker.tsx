import {faCalendar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {useEffect, useState} from 'react'
import {DatePicker} from 'react-rainbow-components'

type DatepickerInputProps = {
  changeDate: (date: Date) => void
}

export const DatepickerInput: React.FC<DatepickerInputProps> = ({changeDate}) => {
  const [date, setDate] = useState(new Date())

  function onChange(date: Date) {
    setDate(date)
    changeDate(date)
  }

  return (
    <div className='px-3'>
      <DatePicker
        isCentered={true}
        value={date}
        onChange={onChange}
        formatStyle='medium'
        icon={<FontAwesomeIcon color='rgb(0, 158, 247)' icon={faCalendar as any} />}
      />
    </div>
  )
}

export const IntervalDatePicker: React.FC<{
  changeStartDate: (date: Date) => void
  changeEndDate: (date: Date) => void
}> = ({changeStartDate, changeEndDate}) => {
  const [range, setRange] = useState([new Date(), new Date()])
  useEffect(() => {
    if (range.length === 2) {
      changeStartDate(range[0])
      changeEndDate(range[1])
    }
  }, [range, changeStartDate, changeEndDate])
  return (
    <div className='px-3'>
      <DatePicker
        isCentered={true}
        selectionType='range'
        value={range}
        onChange={(value: any) => {
          setRange(value)
        }}
        formatStyle='medium'
        icon={<FontAwesomeIcon color='rgb(0, 158, 247)' icon={faCalendar as any} />}
      />
    </div>
  )
}
