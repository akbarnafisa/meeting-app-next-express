export interface ResponseErrorInterface {
  success: boolean;
  data: any | null;
  error: {
    errorMsg?: string;
    errorCode?: string;
    fieldError?: {
      [fieldname: string]: string[];
    };
  };
}
