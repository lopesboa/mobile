// @flow strict

import type {Action} from '../../actions/brands';

export type State = string | null;

export const initialState: State =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWM3NTFhYTY4ZjI3MTMwMDFiMzBlMWIzIiwidXNhZ2UiOiJtb2JpbGUiLCJob3N0IjoiaHR0cHM6Ly9tb2JpbGUtc3RhZ2luZy5jb29ycGFjYWRlbXkuY29tIiwiZ3JhbnRzIjp7Im1vb2MiOnsiZ3JhbnRzIjp7Im1vYmlsZSI6eyJyb2xlcyI6WyJ1c2VyIl19fX19LCJpYXQiOjE1NTExNzg4MTAsImV4cCI6MjAwMDAwMDAwMCwiYXVkIjoibW9iaWxlIiwiaXNzIjoiY29vcnBhY2FkZW15LWp3dCJ9.vC0vxTO8eNk2crp5_nhPgUF7UVqg8K3yFdj6SzHVNIY';

const reducer = (state: State = initialState, action: Action): State => state;

export default reducer;
