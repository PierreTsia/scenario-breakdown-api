export class ProjectDeletedEvent {
  projectId: string;
  description?: string;
  constructor(projectId: string, description?: string) {
    this.projectId = projectId;
    this.description = description;
  }
}
