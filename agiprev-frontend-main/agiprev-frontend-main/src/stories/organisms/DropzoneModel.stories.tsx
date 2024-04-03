import DropzoneModel from '../../components/UI/organisms/uploadModel/DropZoneModel';

export default {
  title: 'Organisms/DropzoneModel',
  component: DropzoneModel,
};

export const Dropzone = () => (
  <DropzoneModel onUploadComplete={() => {}} type="profile" />
);
