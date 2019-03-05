// @flow strict

export type TemplatePartType = 'string' | 'input';

export type TemplatePart = {|
  type: TemplatePartType,
  value: string
|};

type TemplatePartTypeKey = 'STRING' | 'INPUT';
export const TEMPLATE_PART_TYPE: {[TemplatePartTypeKey]: TemplatePartType} = {
  STRING: 'string',
  INPUT: 'input'
};

export const parseTemplate = (template: string): Array<TemplatePart> => {
  if (!template) {
    return [];
  }

  const result = /{{(\w+)}}/.exec(template);
  if (!result) {
    return [{type: TEMPLATE_PART_TYPE.STRING, value: template}];
  }

  const parts: Array<TemplatePart> = [];
  if (result.index !== 0) {
    parts.push({type: TEMPLATE_PART_TYPE.STRING, value: template.slice(0, result.index)});
  }

  parts.push({type: TEMPLATE_PART_TYPE.INPUT, value: result[1]});

  return parts.concat(parseTemplate(template.slice(result.index + result[0].length)));
};

export default {
  parseTemplate
};
