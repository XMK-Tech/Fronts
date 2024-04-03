import { useQuery } from '@tanstack/react-query';
import Api, { getRespContent } from './Api';

export type DynamicFieldsResp = {
  displayTable: string;
  fields: DynamicFieldsRespField[];
};

export type DynamicFieldsRespField = {
  id: string;
  code: string;
  displayTable: string;
  displayColumn: string;
  schema: string;
  table: string;
  column: string;
  columnKey: string;
};

export function useDynamicFieldsByMessageTemplateId(messageTemplateId: string) {
  return useQuery(
    [`dynamic-fields-options`, messageTemplateId],
    async () => {
      const resp = await Api.get(`dynamic-fields-options`, {
        params: {
          MessageTemplateId: messageTemplateId,
        },
      });
      return getRespContent<DynamicFieldsResp[]>(resp);
    },
    { enabled: messageTemplateId.length >= 3 }
  );
}
