export const SUBFIELDS = {
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
