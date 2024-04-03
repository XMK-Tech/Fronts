import { QueryClient, useQuery } from '@tanstack/react-query';
import Api, { getResp } from './Api';
import { SortDirection } from './PhysicalPersonService';
import { openFile } from '../utils/functions/utility';

export enum AttendanceStatus {
  open = 0,
  canceled = 1,
  attending = 2,
  finished = 3,
}

export type AttendanceHistory = {
  id: string;
  message: string;
  ownerId: string;
  owner: string;
  systemGenerated: true;
  date: Date;
  userId: string;
  userName: string;
  createdByManager: boolean;
};

export type AttendanceResp = {
  title: string;
  description: string;
  subjectId: string;
  id: string;
  lastHistoryUpdateAt: Date;
  lastUpdateAt: Date;
  date: Date;
  subject: string;
  currentUserIsRequester: boolean;
  requesterDocument: string;
  requesterId: string;
  requesterName: string;
  responsibleDocument: string;
  responsibleId: string;
  responsibleName: string;
  serialNumber: string;
  attendanceStatus: number;
  attendanceStatusDescription: string;
  attachments: {
    id: string;
    type: string;
    owner: string;
    ownerId: string;
    url: string;
    externalId: string;
    displayName: string;
  }[];
  content: {
    PersonId: string;
    JuridicalOrPhysicalPersonId: string;
    Type: {};
  };
  histories: {
    id: string;
    message: string;
    ownerId: string;
    owner: string;
    systemGenerated: true;
    date: Date;
    userId: string;
    userName: string;
    createdByManager: boolean;
  }[];
  viewers: {
    id: string;
    userId: string;
    userName: string;
    date: Date;
    systemGenerated: true;
    ownerId: string;
    owner: string;
  }[];
};

export function invalidateMessages(
  attendanceId: string,
  queryClient: QueryClient
) {
  queryClient.invalidateQueries({
    queryKey: [`Attendace/History`, attendanceId],
  });
}

export function invalidateAttendance(
  attendanceId: string,
  queryClient: QueryClient
) {
  queryClient.invalidateQueries({ queryKey: [`Attendace`, attendanceId] });
}

export type AttendancePost = {
  title: string;
  description: string;
  subjectId: string;
  attachmentIds: string[];
};

export enum AttendanceShowType {
  All = 0,
  Opened = 1,
  Concluded = 2,
}

export function useAttendace(
  page: number,
  pageSize: number | null,
  search: string,
  searchField: string = 'title',
  sort: string = 'name',
  direction: SortDirection = 'asc',
  status: AttendanceStatus | null = null,
  myAttendances: boolean = false
) {
  return useQuery(
    [
      `AttendanceList`,
      page,
      search,
      searchField,
      sort,
      direction,
      myAttendances,
      status,
    ],
    async () => {
      const resp = await Api.get(`/Attendance`, {
        params: {
          Offset: page,
          Limit: pageSize,
          [searchField]: search,
          SortColumn: sort,
          SortDirection: direction,
          myAttendances: myAttendances,
          AttendanceStatus: status,
        },
      });
      return resp.data.content;
    }
  );
}

export function useAttendaceDetails(id?: string) {
  return useQuery([`Attendace`, id], async () => {
    const resp = await Api.get(`/Attendance/${id}`);
    return getResp<AttendanceResp>(resp);
  });
}

export function useAttendaceHistory(id?: string) {
  return useQuery(
    [`Attendace/History`, id],
    async () => {
      const resp = await Api.get(`/Attendance/${id}/history`);
      return getResp<AttendanceHistory[]>(resp);
    },
    {
      refetchInterval: 10000,
    }
  );
}

export function postMessage({ message, id }: { message: string; id: string }) {
  return Api.post(`/Attendance/${id}/history`, {
    message,
  });
}

export function postAttendance(props: AttendancePost) {
  return Api.post(`/Attendance`, props);
}
export function getAttendanceReport(
  search: string,
  searchField: string = 'title',
  sort: string = 'name',
  direction: SortDirection = 'asc',
  status: AttendanceStatus | null = null,
  myAttendances: boolean = false
) {
  Api.get(`/Attendance/report`, {
    params: {
      [searchField]: search,
      SortColumn: sort,
      SortDirection: direction,
      myAttendances: myAttendances,
      AttendanceStatus: status,
    },
    responseType: 'blob',
  }).then((response) => {
    openFile(response);
  });
}

export function postTransferResponsibility({
  id,
  personId,
}: {
  id: string;
  personId: string;
}) {
  return Api.post(`/Attendance/${id}/transfer-responsibility/${personId}`);
}

export function postTakeResponsibility({ id }: { id: string }) {
  return Api.post(`/Attendance/${id}/take-responsibility`);
}

export function putAttendance({
  id,
  title,
  description,
  subjectId,
  attachmentIds,
}: {
  id?: string;
  title?: string;
  description?: string;
  subjectId?: string;
  attachmentIds: string[];
}) {
  return Api.put(`/Attendance/${id}`, {
    title,
    description,
    subjectId,
    attachmentIds,
  });
}

export function putAttendanceStatus(id?: string) {
  return Api.put(`/Attendance/status/${id}/${3}`);
}

export function putAttendanceFinish(id?: string) {
  return Api.put(`/Attendance/${id}/finish`);
}
export enum LocatorPersonType {
  Null = 0,
  Juridical = 1,
  Physical = 2,
}
