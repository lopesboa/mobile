export type TemplatePartType = 'string' | 'input' | 'carriageReturn';

export type TemplatePart = {
  type: TemplatePartType;
  value?: string;
};

type TemplatePartTypeKey = 'STRING' | 'INPUT' | 'CARRIAGE_RETURN';
export const TEMPLATE_PART_TYPE: {
  [key in TemplatePartTypeKey]?: TemplatePartType;
} = {
  STRING: 'string',
  INPUT: 'input',
  CARRIAGE_RETURN: 'carriageReturn',
};

export const parseTemplate = (_template: string): Array<TemplatePart> => {
  const template = _template.replace(/<br\s*\/*>/g, '<br>').replace(/\r?\n|\r/g, '<br>');

  const parts: Array<TemplatePart> = [];

  const splitedTemplate = template.split(/({{\w+}})/);

  const regexInput = /({{\w+}})/;

  splitedTemplate.map((item) => {
    if (item.search(regexInput) !== -1) {
      return parts.push({
        type: TEMPLATE_PART_TYPE.INPUT,
        value: item.slice(2, -2),
      });
    } else if (item !== '') {
      return parts.push({type: TEMPLATE_PART_TYPE.STRING, value: item});
    } else {
      return null;
    }
  });

  return parts;
};

export default {
  parseTemplate,
};
