// @flow strict

export type TemplatePartType = 'string' | 'input' | 'carriageReturn';

export type TemplatePart = {|
  type: TemplatePartType,
  value?: string
|};

type TemplatePartTypeKey = 'STRING' | 'INPUT' | 'CARRIAGE_RETURN';
export const TEMPLATE_PART_TYPE: {[TemplatePartTypeKey]: TemplatePartType} = {
  STRING: 'string',
  INPUT: 'input',
  CARRIAGE_RETURN: 'carriageReturn'
};

export const parseTemplate = (_template: string): Array<TemplatePart> => {
  const template = _template.replace(/<br\s*\/*>/g, '<br>');

  if (!template) {
    return [];
  }

  const result = /({{\w+}}|<br>)/.exec(_template);
  if (!result) {
    return [{type: TEMPLATE_PART_TYPE.STRING, value: template}];
  }

  const parts: Array<TemplatePart> = [];
  if (result.index !== 0) {
    parts.push({type: TEMPLATE_PART_TYPE.STRING, value: template.slice(0, result.index)});
  }

  if (result[1] === '<br>') {
    parts.push({type: TEMPLATE_PART_TYPE.CARRIAGE_RETURN});
  } else {
    parts.push({type: TEMPLATE_PART_TYPE.INPUT, value: result[1].slice(2, -2)});
  }

  return parts.concat(parseTemplate(template.slice(result.index + result[0].length)));
};

export default {
  parseTemplate
};
