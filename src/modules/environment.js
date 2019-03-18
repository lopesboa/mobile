// @flow strict

const {REACT_NATIVE_FLAVOR} = process.env;

export const __E2E__ = REACT_NATIVE_FLAVOR === 'E2E';

const env = process.env;
export const __ENV__ = env.NODE_ENV;
export const __TEST__ = __ENV__ === 'test';
export const __DEV__ = __ENV__ === 'development';

export const DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWM3NTFhYTY4ZjI3MTMwMDFiMzBlMWIzIiwidXNhZ2UiOiJtb2JpbGUiLCJob3N0IjoiaHR0cHM6Ly9tb2JpbGUtc3RhZ2luZy5jb29ycGFjYWRlbXkuY29tIiwiZ3JhbnRzIjp7Im1vb2MiOnsiZ3JhbnRzIjp7Im1vYmlsZSI6eyJyb2xlcyI6WyJ1c2VyIl19fX19LCJpYXQiOjE1NTExNzg4MTAsImV4cCI6MjAwMDAwMDAwMCwiYXVkIjoibW9iaWxlIiwiaXNzIjoiY29vcnBhY2FkZW15LWp3dCJ9.vC0vxTO8eNk2crp5_nhPgUF7UVqg8K3yFdj6SzHVNIY';

export default {
  __E2E__,
  __ENV__,
  __TEST__,
  __DEV__,
  DEV_TOKEN
};
