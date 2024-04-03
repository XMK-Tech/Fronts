import { useQuery } from '@tanstack/react-query';
import Api, { getRespContent } from './Api';

export type MessageTemplateResp = {
  id: string;
  code?: string;
  messageType?: number;
  templateName: string;
  subject: string;
  message: string;
  sendCopyMyself: boolean;
};

export type MessageTemplate = {
  id: string;
  templateName: string;
  subject: string;
  message: string;
  sendCopyMyself: boolean;
};

export function useMessageTemplates(page: number, pageSize: number | null) {
  return useQuery([`messageTemplates`, page], async () => {
    const resp = await Api.get(`/message-templates`, {
      params: {
        Offset: page,
        Limit: pageSize,
      },
    });
    return getRespContent<MessageTemplateResp[]>(resp);
  });
}

export function putMessageTemplate(props: MessageTemplate) {
  return Api.put(`/message-templates/${props.id}`, props);
}
