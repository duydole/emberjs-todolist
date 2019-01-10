import { helper } from '@ember/component/helper';

export function formatMarkdown(params/*, hash*/) {
  return Ember.String.htmlSafe(new showdown.Converter().makeHtml(params[0]));
}

export default helper(formatMarkdown);
