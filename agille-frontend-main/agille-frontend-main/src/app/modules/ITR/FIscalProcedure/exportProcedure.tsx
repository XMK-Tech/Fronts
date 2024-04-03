import saveAs from 'file-saver'
import JSZip from 'jszip'
import {
  FiscalProcedure,
  getFiscalProcedure,
  ProcedurePhase,
} from '../../../services/FiscalProcedureApi'
import {formatDate} from '../../../utils/functions'
import {getParameterLabel} from './getParameterLabel'

export function download(filename: string, text: string) {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
function parseProcedure(
  procedure: FiscalProcedure,
  phase: ProcedurePhase,
  url: string,
  propriedade: FiscalProcedure['propriety']
) {
  return `${phase.id}|${propriedade?.name}|${propriedade?.incraCode}|${2022}|${getParameterLabel(
    !!procedure.taxParams?.length ? procedure.taxParams[0] : 0
  )}|${formatDate(new Date(phase.createdAt ?? ''))}|${phase?.number}|${url}`
}

type FileParams = {
  id: string
  url: string | null
}

export async function zipFiles(files: FileParams[], zipname: string) {
  const zip = new JSZip()
  let hasAny = false
  for (const file of files) {
    if (!file.url) continue
    const extension = file.url.split('?')[0].split('.').pop()
    const blob = await fetch(file.url).then((res) => res.blob())
    if (blob) {
      hasAny = true
      zip.file<'blob'>(file.id + '.' + extension, blob)
    }
  }
  if (!hasAny) return false
  const content = await zip.generateAsync({type: 'blob'})
  saveAs(content, zipname)
  return true
}

export async function exportProcedures(procedureIds: string[]) {
  let exportedAny = false
  for (const procedureId of procedureIds) {
    const wasExported = await exportProcedure(procedureId)
    if (wasExported) exportedAny = true
  }
  return exportedAny
}

export async function exportProcedure(procedureId: string, phaseId?: string) {
  const files: FileParams[] = []
  const response = await getFiscalProcedure(procedureId)
  const data: FiscalProcedure = response.data
  if (phaseId) {
    files.push({id: phaseId, url: data.stages.find((p) => p.id === phaseId)?.fileUrl || ''})
  } else {
    for (const phase of data.stages) {
      files.push({id: phase.id, url: phase.fileUrl})
    }
  }
  return zipFiles(files, `${data.propriety?.name}_${data.id}.zip`)
}
