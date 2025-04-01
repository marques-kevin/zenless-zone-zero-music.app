export type IRepositoryResponse<T> =
  | {
      error: true;
      code: string;
      message: string;
    }
  | {
      error: false;
      data: T;
    };
