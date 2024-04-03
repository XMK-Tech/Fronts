import dayjs from 'dayjs'
import {useMemo} from 'react'
import {useLocation} from 'react-router-dom'

export function getDate(date: string) {
  const newDate = new Date(date)
  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, '0')
  const day = String(newDate.getDate()).padStart(2, '0')
  const parsedDate = `${day}/${month}/${year}`
  return parsedDate
}
export function formtUtcDate(date: string) {}
export function formtUtcTime(time: string) {}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export function getFileNameFromUrl(url: string | undefined | null) {
  if (!url) {
    return ''
  }
  return url.split('?')[0].split('/').pop()
}

export function buildSearchArgs(value: string | undefined, field: string | undefined) {
  if (!value || !field) {
    return {}
  }
  const args: Record<string, string> = {
    [capitalizeFirstLetter(field)]: value,
  }
  return args
}

export function getPaginationParams(page: number, limit: number = 10) {
  return {Limit: limit, Offset: page}
}
export const numberLimit = (number: number, setNumber: (n: number) => void, limit: number) => {
  if (number > limit) {
    return
  } else {
    setNumber(number)
    return
  }
}

export function getMonthandYear(date: string) {
  const newDate = new Date(date)
  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, '0')
  const parsedDate = `${month}/${year}`
  return parsedDate
}

export function takeFirstIfOnly<T>(arr?: T[]) {
  return arr?.length === 1 ? arr[0] : undefined
}

export function spreadText(text: string, maxSize: number) {
  return text.length < maxSize ? text : `${text.slice(0, maxSize - 3)}...`
}

export const distinctValues = (value: any, index: number, self: any) => {
  return self.indexOf(value) === index
}

export const sumValues = (data: number[]) => {
  return data.reduce((cur, next) => cur + next, 0)
}

export const calculateAverage = (data: number[]) => {
  const numberOfItems = data.length
  if (numberOfItems === 0) return 0
  const total = sumValues(data)
  return total / numberOfItems
}

export function getInitialReferenceMonth(prevInitialMonth: string, reference: string): string {
  const prevYear = Number(prevInitialMonth.slice(4))
  const newYear = Number(reference.slice(4))
  if (newYear < prevYear) return reference
  if (prevYear < newYear) return prevInitialMonth
  const prevMonth = Number(prevInitialMonth.slice(0, 2))
  const newMonth = Number(reference.slice(0, 2))

  if (newMonth < prevMonth) return reference

  return prevInitialMonth
}
export function getFinalReferenceMonth(prevFinalMonth: string, reference: string): string {
  const prevYear = Number(prevFinalMonth.slice(4))
  const newYear = Number(reference.slice(4))

  if (newYear > prevYear) return reference
  if (prevYear > newYear) return prevFinalMonth
  const prevMonth = Number(prevFinalMonth.slice(0, 2))
  const newMonth = Number(reference.slice(0, 2))

  if (newMonth > prevMonth) return reference

  return prevFinalMonth
}

export function formatCnpj(text: string | undefined) {
  if (!text) return ''
  return text.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1 $2 $3/$4-$5')
}
export function formatCpf(text: string | undefined) {
  if (!text) return ''
  return text.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3-$4')
}

export function formatMoney(value: number) {
  return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}
export function formatArea(value: number) {
  return `${value}ha`
}

export function flatArray<T>(arr: T[][]): T[] {
  //@ts-ignore
  return [].concat.apply([], arr)
}

export function formatAsDate(date: Date) {
  return dayjs(date).format('YYYY-MM-DD')
}

export function formatDate(date: string | number | Date | undefined | null): string {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

export function intlDate(date: string | number | Date | undefined | null): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

export function formatTime(date: string | number | Date | undefined | null): string {
  if (!date) return ''
  return dayjs(date).format('HH:mm')
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useQuery() {
  const {search} = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export function parseCoordinate(rawCenter: any) {
  return rawCenter?.replace('[', '')?.replace(']', '')?.split(';')?.map(Number)
}

export function checkHasText(text: string) {
  if (text === '' || text === null || text === undefined) {
    return 'Não informado'
  }
  return text
}

export function sanitizeMoney(value: string) {
  const withoutPrefix = value.replace('R$', '')
  const withoutDots = withoutPrefix.replace('.', '')
  const withoutCommas = withoutDots.replace(',', '.')
  return withoutCommas
}

export function showConfirmSubmit() {
  return window.confirm('As alterações não salvas serão perdidas. Tem certeza que deseja sair?')
}
