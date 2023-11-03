type CustomFormatHandler = (row: any, column: IColumnConfig) => string;

export interface IColumnConfig {
    fieldName: string;
    title: string;
    type: "id" | "boolean" | "string" | "number";
    customFormat?: CustomFormatHandler;
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
                },
                {
                    fieldName: "title",
                    title: "Title",
                    type: "string",
                },
                {
                    fieldName: "completed",
                    title: "Completed",
                    type: "boolean",
                }
            ]
        }

    }
}