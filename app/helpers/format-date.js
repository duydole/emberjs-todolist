import { helper } from '@ember/component/helper';
import moment from 'moment';

export function formatDate(params/*, hash*/) {
  return moment(params[0]).format("DD-MM-YYYY");
}

export default helper(formatDate);
