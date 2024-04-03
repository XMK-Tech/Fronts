import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './quill-editor.scss'

export function RichEditor({
  template,
  setTemplate,
}: {
  template: string
  setTemplate: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <ReactQuill theme='snow' className='w-100 h-600px' value={template} onChange={setTemplate} />
  )
}
