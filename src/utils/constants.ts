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
  project: { path: 'project', model: 'Project' },
  comments: {
    path: 'comments',
    model: 'Comment',
    populate: {
      path: 'createdBy',
      model: 'User',
    },
    options: {
      sort: '-createdAt',
    },
  },
  createdBy: { path: 'createBy', model: 'User' },
};
