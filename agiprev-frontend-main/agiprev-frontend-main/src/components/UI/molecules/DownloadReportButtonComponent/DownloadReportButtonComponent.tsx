import React from 'react';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { useIsWeb } from '../../../../hooks/useIsWeb';
import MenuButtonComponent from '../MenuButtonComponent/MenuButtonComponent';
import { ExportType } from '../../../../services/RevenueService';

type DownloadReportButtonComponentProps = {
  width?: string | number;
  m?: string | number;
  downloadReport: (type: ExportType) => Promise<void>;
};

export default function DownloadReportButtonComponent(
  props: DownloadReportButtonComponentProps
) {
  const isWeb = useIsWeb();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  return (
    <MenuButtonComponent
      label={'Emitir Relatório'}
      width={props.width || isWeb ? '' : '100%'}
      m={props.m || isWeb ? '0 10px 0 0' : '0 0 10px 0'}
      isLoading={isLoading}
      disabled={isLoading}
      items={[
        {
          icon: <FaFilePdf />,
          label: 'PDF',
          onClick: () => {
            setIsLoading(true);
            props.downloadReport('PDF').then(() => {
              setIsLoading(false);
            });
          },
        },
        {
          icon: <FaFileCsv />,
          label: 'CSV',
          onClick: () => {
            setIsLoading(true);
            props.downloadReport('CSV').then(() => {
              setIsLoading(false);
            });
          },
        },
      ]}
    />
  );
}
