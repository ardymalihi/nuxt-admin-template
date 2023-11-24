type CustomFormatHandler = (row: any, column: IColumnConfig, value: any) => string;
type ColumnValidationHandler = (row: any, column: IColumnConfig, value: any) => string | undefined;
type FormValidationHandler = (model: any) => Promise<string | undefined>;
export interface IColumnConfig {
    fieldName: string;
    title: string;
    type: "id" | "boolean" | "string" | "number" | "lookup" | "memo" | "image_url" | "date" | "file_url" | "timestamp";
    defaultValue?: any;
    columnOrder: number;
    formOrder: number;
    required: boolean;
    lookup?: {
        sourceType: "table";
        name: string;
        idFieldName: string;
        displayFieldName: string;
    }
    customFormatter?: CustomFormatHandler;
    validations?: ColumnValidationHandler[];
}

export interface ITableConfig {
    name: string;
    columns: IColumnConfig[];
    validation?: FormValidationHandler;
    title: string;
}

export interface ISchema {
    tables: ITableConfig[];
}

export interface IAppConfig {
    schema: ISchema;
}


export type TableNames =  string;