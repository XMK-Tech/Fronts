import axios, { AxiosError, AxiosResponse } from 'axios';
import { formatDate } from './formatDate';
import * as yup from 'yup';
import dayjs from 'dayjs';
import TextComponent from '../../components/UI/atoms/TextComponent/TextComponent';
import { moneyMask } from './masks';
import { useUserData } from '../../services/LoginService';

export function parseDate(date: string | Date | undefined | null) {
  if (!date) return '';
  return String(date).split('T')[0];
}

export function parseMonth(date: string | Date | undefined | null) {
  if (!date) return '';
  const newDate = String(date).split('T')[0].split('-');
  return `${newDate[0]}-${newDate[1]}`;
}

export function parseDateToForm(
  date: string | Date | null | undefined
): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

export function getFirstIfAny<T>(array: T[] | undefined | null) {
  if (!array) return null;
  return array[0] || null;
}

export function exportFile(response: AxiosResponse, name: string = '') {
  const file = new Blob([response.data], { type: response.data.type });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(file);
  element.download = `${name}-${formatDate(Date.now())}${
    response.data.type === 'application/xlsx' ? '.xlsx' : ''
  }`;
  document.body.appendChild(element);
  element.click();
}

export function openFile(response: AxiosResponse) {
  const file = new Blob([response.data], { type: response.data.type });
  const url = URL.createObjectURL(file);
  window.open(url);
}

export function getError(
  error: Error | AxiosError | unknown | null | undefined
) {
  if (axios.isAxiosError(error)) {
    const resp = error.response?.data as { error: string };
    return resp.error || '';
  }
  return 'Ocorreu um erro desconhecido';
}

export function validateOptionalFields<T extends object>(
  object: T,
  optionalFields: (keyof T)[]
) {
  return Object.entries(object).some(([key, value]) => {
    const isOptional = optionalFields.includes(key as keyof T);
    return !isOptional && !value;
  });
}

export function checkFormValue(
  form: Object,
  formSchema: yup.AnyObject,
  field: string
) {
  try {
    formSchema.validateSyncAt(field, form);
    return '';
  } catch (err: any) {
    return err.message;
  }
}

export function dataTotal(list: any[], total: number) {
  if (list.length === 0) {
    return list;
  }
  const itemsLength = list[0].items.length;
  const totalArray = [
    ...list,
    {
      items: [
        <TextComponent key={1} fontSize={'lg'} fontWeight={'medium'} mr={10}>
          Total:
        </TextComponent>,
        <TextComponent key={2} fontSize={'lg'} fontWeight={'medium'} mr={30}>
          {moneyMask(total.toString())}
        </TextComponent>,
      ],
    },
  ];
  for (let i = 0; i < itemsLength - 2; i++) {
    totalArray[totalArray.length - 1].items.unshift('');
  }
  return totalArray;
}

export function useDateSelectedYear() {
  const user = useUserData();
  const today = new Date();
  return `${user?.year ?? today.getFullYear()}-${dayjs(today).format('MM-DD')}`;
}
