export function getParameterLabel(i: number) {
  return parametersData.find((p) => Number(p.value) == i)?.label
}
export const parametersData = [
  {value: '1', label: 'Benfeitoria'},
  {value: '2', label: 'Área ambiental'},
  {value: '3', label: 'Área Utilizada'},
  {value: '4', label: 'Valor de terra nua'},
]
