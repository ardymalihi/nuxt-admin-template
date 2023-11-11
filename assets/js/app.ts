type CustomFormatHandler = (row: any, column: IColumnConfig, value: any) => string;

export interface IColumnConfig {
    fieldName: string;
    title: string;
    type: "id" | "boolean" | "string" | "number" | "lookup";
    defaultValue?: any;
    columnOrder?: number;
    formOrder?: number;
    lookup?: {
        sourceType: "table";
        name: string;
        idFieldName: string;
        displayFieldName: string;
    }
    editable?: boolean;
    priority?: number;
    customFormatter?: CustomFormatHandler;
}

export interface ITableConfig {
    editable: boolean;
    columns: IColumnConfig[] | null,
}

export interface IAppConfig {
    table: {
        [key in TableNames]: ITableConfig;
    }
}


export type TableNames = 'tasks';

export const app: IAppConfig = {
    table: {
        tasks:
        {
            editable: true,
            columns: [
                {
                    fieldName: "id",
                    title: "ID",
                    type: "id",
                    columnOrder: 0,
                },
                {
                    fieldName: "user_id",
                    title: "User",
                    type: "lookup",
                    lookup: {
                        sourceType: "table",
                        name: "profiles",
                        idFieldName: "id",
                        displayFieldName: "first_name,last_name",
                    },
                    formOrder: 3,
                },
                {
                    fieldName: "title",
                    title: "Title",
                    type: "string",
                    defaultValue: "Hi There!",
                    formOrder: 1,
                },
                {
                    fieldName: "completed",
                    title: "Completed",
                    type: "boolean",
                    defaultValue: true,
                    formOrder: 2,
                }
            ]
        }

    }
}