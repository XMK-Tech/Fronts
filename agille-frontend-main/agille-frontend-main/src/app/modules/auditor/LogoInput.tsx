import React from 'react'
import {Attachment, uploadAttachment} from '../../services/AttachmentApi'

export function LogoInput({
  entityImage,
  onUpload,
}: {
  entityImage: string
  onUpload: (data: Attachment) => void
}) {
  return (
    <div className='col-lg-8'>
      <div
        className='image-input image-input-outline'
        data-kt-image-input='true'
        style={{
          backgroundImage: `url("https://via.placeholder.com/500")`,
        }}
      >
        <div
          className='image-input-wrapper w-125px h-125px'
          style={{
            backgroundImage: `url("${
              entityImage ||
              'https://thumbs.dreamstime.com/b/blank-man-profile-head-icon-avatar-blank-man-profile-head-icon-avatar-social-media-websites-208480728.jpg'
            }")`,
          }}
        ></div>

        <label
          className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
          data-kt-image-input-action='change'
          data-bs-toggle='tooltip'
          title=''
          data-bs-original-title='Change avatar'
        >
          <i className='bi bi-pencil-fill fs-7'></i>

          <input
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const response = await uploadAttachment({
                attachment: file,
                owner: 'entity',
                ownerId: '1',
              })
              onUpload(response.data)
            }}
            type='file'
            name='avatar'
            accept='.png, .jpg, .jpeg'
          ></input>
          <input type='hidden' name='avatar_remove'></input>
        </label>

        <span
          className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
          data-kt-image-input-action='cancel'
          data-bs-toggle='tooltip'
          title=''
          data-bs-original-title='Cancel avatar'
        >
          <i className='bi bi-x fs-2'></i>
        </span>

        <span
          className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
          data-kt-image-input-action='remove'
          data-bs-toggle='tooltip'
          title=''
          data-bs-original-title='Remove avatar'
        >
          <i className='bi bi-x fs-2'></i>
        </span>
      </div>

      <div className='form-text'>
        Tipos de arquivo permitidos: <br /> png, jpg, jpeg.
      </div>
    </div>
  )
}
