import { useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';

export type AttendanceSubjectResp = {
  subject: string;
  description: string;
  mandatoryAttachment: boolean;
  id: string;
  registeredById: string;
  registeredByName: string;
  createdAt: string;
  defaultResponses: [
    {
      subjectId: string;
      title: string;
      response: string;
      id: string;
      createdAt: string;
    }
  ];
};

export function useAttendaceSubjectById(id?: string, enabledSubject?: boolean) {
  return useQuery(
    [`AttendaceSubject`, id],
    async () => {
      const resp = await Api.get(`/AttendanceSubject/${id}`);
      return getResp<AttendanceSubjectResp>(resp);
    },
    {
      enabled: enabledSubject,
    }
  );
}

export function useAttendaceSubject() {
  return useQuery([`AttendaceSubject`], async () => {
    const resp = await Api.get(`/AttendanceSubject`);
    return getResp<AttendanceSubjectResp[]>(resp);
  });
}
