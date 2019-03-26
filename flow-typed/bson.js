declare module "bson" {
  declare export class ObjectId {
    toString(): string;
    static isValid(id: any): boolean;
  }
}
