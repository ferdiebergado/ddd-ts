export type EntityId = any;

export interface Entity {
  _id: EntityId;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | undefined;
  createdBy?: EntityId;
  updatedBy?: EntityId;
  deletedBy?: EntityId;
  [key: string]: any;
}

export type EntityIdField = Entity['_id'];

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorBag {
  errors: ValidationError[];
}

export abstract class Entity {
  constructor() {
    const dateStr = this.getDateString();
    this.createdAt = dateStr;
    this.updatedAt = dateStr;
  }

  // eslint-disable-next-line class-methods-use-this
  private getDateString() {
    return new Date().toISOString();
  }

  touch(): void {
    this.updatedAt = this.getDateString();
  }

  abstract validate(): ValidationError[];
}
