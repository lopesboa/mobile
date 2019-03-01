declare module "cross-fetch" {
  declare module.exports: (
    input: string | Request | URL,
    init?: RequestOptions
  ) => Promise<Response>;
}
