type CustomFormatHandler = (row: any, column: IColumnConfig, value: any) => string;
type ColumnValidationHandler = (row: any, column: IColumnConfig, value: any) => string | undefined;
type FormValidationHandler = (model: any) => Promise<string | undefined>;
export interface IColumnConfig {
    fieldName: string;
    title: string;
    type: "id" | "boolean" | "string" | "number" | "lookup" | "memo" | "image_url" | "date" | "file_url";
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
    editable?: boolean;
    customFormatter?: CustomFormatHandler;
    validations?: ColumnValidationHandler[];
}

export interface ITableConfig {
    editable: boolean;
    columns: IColumnConfig[] | null;
    validation?: FormValidationHandler;
}

export interface ISchema {
    table: {
        [key in TableNames]: ITableConfig;
    }
}

export interface IAppConfig {
    schema: ISchema;
}


export type TableNames = 'tasks' | 'tasks_progress';

export const app: IAppConfig = {
    schema: {
    table: {
        tasks:
        {
            editable: true,
            validation: async (model) => {
                if (model.title === "task123") {
                    return "This task is already taken";
                }
            },
            columns: [
                {
                    fieldName: "id",
                    title: "ID",
                    type: "id",
                    columnOrder: 0,
                    required: false,
                    formOrder: 1,
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
                    columnOrder: 2,
                    required: true,
                },
                {
                    fieldName: "title",
                    title: "Title",
                    type: "string",
                    defaultValue: "Hi There!",
                    formOrder: 1,
                    columnOrder: 3,
                    required: true,
                    validations: [
                        (row, column, value) => {
                            if (String(value).length <= 3) {
                                return "Title length should be greater than 3 characters"
                            }
                        }
                    ]
                },
                {
                    fieldName: "completed",
                    title: "Completed",
                    type: "boolean",
                    defaultValue: true,
                    formOrder: 2,
                    required: false,
                    columnOrder: 4,
                },
                {
                    fieldName: "description",
                    title: "Description",
                    type: "memo",
                    formOrder: 4,
                    columnOrder: 5,
                    required: false,
                    validations: [
                        (row, column, value) => {
                            if (!String(value).startsWith('desc.')) {
                                return "Description should starts with 'desc.'"
                            }
                        }
                    ]
                },
                {
                    fieldName: "image_url",
                    title: "Image",
                    type: "image_url",
                    formOrder: 0,
                    required: true,
                    columnOrder: 1,
                },
                {
                    fieldName: "file_url",
                    title: "Document",
                    type: "file_url",
                    formOrder: 5,
                    required: true,
                    columnOrder: 8,
                },
                {
                    fieldName: "assigned_date",
                    title: "Assigned Date",
                    type: "date",
                    formOrder: 4,
                    required: true,
                    columnOrder: 7,
                    validations:[
                        (row, column, value) => {
                            if (new Date(String(value)).getFullYear() < 2018) {
                                return "Assigned Year cannot be less than 2018"
                            }
                        }
                    ]
                },
            ]
        },
        tasks_progress: {
            editable: true,
            columns: [
                {
                    fieldName: "id",
                    title: "ID",
                    type: "id",
                    columnOrder: 0,
                    required: false,
                    formOrder: 1,
                },
                {
                    fieldName: "created_date",
                    title: "Created Date",
                    type: "date",
                    formOrder: 2,
                    required: true,
                    columnOrder: 1,
                },
                {
                    fieldName: "task_id",
                    title: "Task",
                    type: "lookup",
                    lookup: {
                        sourceType: "table",
                        name: "tasks",
                        idFieldName: "id",
                        displayFieldName: "title",
                    },
                    formOrder: 3,
                    columnOrder: 2,
                    required: true,
                },
            ]
        }
    }
}
}