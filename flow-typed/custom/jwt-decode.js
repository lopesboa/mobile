declare module "jwt-decode" {
  declare export default function decode<T>(token: string, options?: { header: boolean }): T;
}
