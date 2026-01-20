
export interface ImageState {
  original: string | null;
  transformed: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TransformationParams {
  style: string;
  clothing: string;
  lighting: string;
  background: string;
}
