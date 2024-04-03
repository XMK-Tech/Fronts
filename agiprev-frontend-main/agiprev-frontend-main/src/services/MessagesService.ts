import { openFile } from '../utils/functions/utility';
import Api from './Api';

export function getMessageReport() {
  Api.get(`/messages/report`, {
    responseType: 'blob',
  }).then((response) => {
    openFile(response);
  });
}
