export const SEPARATOR = '%%';
export const HTML_SEPARATOR = '__START__%P';
export const REGXP = {
  OL: /<ol[^>]*>/g,
  OL_CLOSED: /<\/?ol[^>]*>/g,
  H1: /<h1[^>]*>/g,
  H1_CLOSED: /<\/?h1[^>]*>/g,
  P: /<p[^>]*>/g,
};
export const SUBFIELDS = {
  chapter: {
    path: 'chapter',
    model: 'Chapter',
    populate: { path: 'project', model: 'Project' },
  },
  chapters: {
    path: 'chapters',
    model: 'Chapter',
  },
  entity: {
    path: 'entity',
    model: 'Entity',
  },
  paragraphs: { path: 'paragraphs', model: 'Paragraph' },
  project: {
    path: 'project',
    model: 'Project',
    populate: {
      path: 'createdBy',
      model: 'User',
    },
  },
  comments: {
    path: 'comments',
    model: 'Comment',
    populate: {
      path: 'createdBy',
      model: 'User',
    },
    options: {
      sort: '-creationDate',
    },
  },
  createdBy: { path: 'createdBy', model: 'User' },
};
export const COLORS = [
  '#C62828',
  '#880E4F',
  '#4A148C',
  '#512DA8',
  '#303F9F',
  '#1976D2',
  '#0288D1',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#689F38',
  '#AFB42B',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
];
