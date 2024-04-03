import React from 'react';
import Dropzone from 'react-dropzone';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import imageUpload from './img-drop-zone/upload-nuvem.png';
import { FaPencilAlt } from 'react-icons/fa';
import { AttachmentType, uploadFiles } from './UploadApi';
import { Box } from '@chakra-ui/react';
const colors = {
  blue: '#3059BA',
  black: '#000000',
  gray: '#9FA0A1',
  bg: '#F7FAFC',
};

type ContainerDropZoneImgProps = {
  children?: React.ReactNode;
  sizeImg?: number;
  src?: string;
};
export function ContainerDropZoneImg(props: ContainerDropZoneImgProps) {
  return (
    <div
      style={{
        width: 130,
        height: 130,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <img
        width={props.sizeImg || 127}
        height={props.sizeImg || 127}
        style={{ borderRadius: '50%' }}
        src={props.src}
        alt=""
      />
      {props.children}
    </div>
  );
}
function ContainerSquare(props: ContainerDropZoneProps) {
  return (
    <section
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 130,
        borderStyle: props.isFile ? 'solid' : 'dashed',
        borderColor: colors.blue,
        borderWidth: 1,
        borderRadius: 8,
      }}
    >
      {props.children}
    </section>
  );
}
function ContainerCircle(props: ContainerDropZoneProps) {
  return (
    <section
      style={{
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 130,
        borderStyle: props.isFile ? 'solid' : 'dashed',
        borderColor: colors.blue,
        borderWidth: 1,
        borderRadius: '50%',
      }}
    >
      {props.children}
    </section>
  );
}
type ContainerDropZoneProps = {
  children: React.ReactNode;
  isFile?: boolean;
  type?: 'profile' | 'archive';
};
function ContainerDropZone(props: ContainerDropZoneProps) {
  return props.type === 'archive' ? (
    <ContainerSquare children={props.children} />
  ) : (
    <ContainerCircle children={props.children} />
  );
}
type DropzoneModelProps = {
  type?: 'profile' | 'archive';
  fileUrl?: string;
  size?: number;
  onUploadComplete?: (attachments: AttachmentType[]) => void;
  setProfilePicUrl?: (url: string) => void;
};
export default function DropzoneModel(props: DropzoneModelProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const isFile = files.length > 0;

  return (
    <Dropzone
      accept={{ 'image/*': [] }}
      onDrop={async (acceptedFiles) => {
        setFiles(acceptedFiles);
        //TODO: handle error
        const responses = await uploadFiles(acceptedFiles);
        props.onUploadComplete?.(responses);
        props.setProfilePicUrl && props.setProfilePicUrl(responses[0].url);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <ContainerDropZone type={props.type} isFile={isFile}>
          <>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {props.fileUrl || isFile ? (
                <ContainerDropZoneImg
                  sizeImg={123}
                  src={isFile ? URL.createObjectURL(files?.[0]) : props.fileUrl}
                ></ContainerDropZoneImg>
              ) : (
                <ContainerDropZoneImg sizeImg={60} src={imageUpload}>
                  <b
                    style={{
                      textAlign: 'center',
                      fontSize: '10px',
                      color: colors.gray,
                    }}
                  >
                    Solte os arquivos aqui
                  </b>
                  <span
                    style={{
                      textAlign: 'center',
                      fontSize: '14px',
                      color: colors.gray,
                    }}
                  >
                    ou
                  </span>
                </ContainerDropZoneImg>
              )}
            </div>
            {props.fileUrl || isFile ? (
              <EditButtonDropZone
                setFiles={setFiles}
                onUploadComplete={props?.onUploadComplete}
                setProfilePicUrl={props.setProfilePicUrl}
              />
            ) : (
              <SelectArchiveButtonDropZone
                setFiles={setFiles}
                onUploadComplete={props?.onUploadComplete}
                setProfilePicUrl={props.setProfilePicUrl}
              />
            )}
          </>
        </ContainerDropZone>
      )}
    </Dropzone>
  );
}

type EditButtonDropZoneProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onUploadComplete?: (attachments: AttachmentType[]) => void;
  setProfilePicUrl?: (url: string) => void;
};

function EditButtonDropZone(props: EditButtonDropZoneProps) {
  return (
    <Dropzone
      accept={{ 'image/*': [] }}
      onDrop={async (acceptedFiles) => {
        props.setFiles(acceptedFiles);
        const responses = await uploadFiles(acceptedFiles);
        props.onUploadComplete?.(responses);
        props.setProfilePicUrl && props.setProfilePicUrl(responses[0].url);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <Box
          {...getRootProps()}
          style={{
            position: 'relative',
            bottom: 145,
            width: 30,
            height: 30,
            left: 110,
            backgroundColor: colors.blue,
            borderColor: colors.blue,
            borderWidth: 1,
            borderRadius: '50%',
          }}
        >
          <Box style={{ marginLeft: 8, cursor: 'pointer', paddingTop: '5px' }}>
            <FaPencilAlt color="white" />
          </Box>
        </Box>
      )}
    </Dropzone>
  );
}
function SelectArchiveButtonDropZone(props: EditButtonDropZoneProps) {
  return (
    <Dropzone
      accept={{ 'image/*': [] }}
      onDrop={async (acceptedFiles) => {
        props.setFiles(acceptedFiles);
        const responses = await uploadFiles(acceptedFiles);
        props.onUploadComplete?.(responses);
        props.setProfilePicUrl && props.setProfilePicUrl(responses[0].url);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <Box {...getRootProps()} marginTop={8}>
          <ButtonComponent className={'button-upload'} onSubmit={() => {}}>
            Selecionar Arquivos
          </ButtonComponent>
        </Box>
      )}
    </Dropzone>
  );
}
