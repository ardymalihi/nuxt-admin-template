import { IAppConfig } from "./types";

export const app: IAppConfig = {
    schema: {
        tables: [
            {
                name: "tasks",
                title: "Tasks",
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
                        validations: [
                            (row, column, value) => {
                                if (new Date(String(value)).getFullYear() < 2018) {
                                    return "Assigned Year cannot be less than 2018"
                                }
                            }
                        ]
                    },
                ]
            },
            {
                name: "tasks_assignee",
                title: "Tasks Assignee",
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
                        fieldName: "from_task",
                        title: "From Task",
                        type: "lookup",
                        lookup: {
                            sourceType: "table",
                            name: "tasks",
                            idFieldName: "id",
                            displayFieldName: "title",
                        },
                        formOrder: 2,
                        columnOrder: 2,
                        required: true,
                    },
                    {
                        fieldName: "to_user",
                        title: "To User",
                        type: "lookup",
                        lookup: {
                            sourceType: "table",
                            name: "profiles",
                            idFieldName: "id",
                            displayFieldName: "first_name",
                        },
                        formOrder: 3,
                        columnOrder: 3,
                        required: true,
                    },
                ],
            },
            {
                name: "tasks_progress",
                title: "Tasks Completion",
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
                        fieldName: "percentage",
                        title: "% Completed",
                        type: "number",
                        formOrder: 2,
                        required: true,
                        columnOrder: 2,
                        validations: [
                            (row, column, value) => {
                                if (Number(value) < 0 || Number(value) > 100) {
                                    return "percentage should be between 0 and 100";
                                }
                            }
                        ],
                        customFormatter: (row, column, value) => {
                            if (value === 67) {
                                return `<span class="bg-red-500 p-2 rounded-md">${value}</span>`
                            } else {
                                return value;
                            }
                        }
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
                        columnOrder: 1,
                        required: true,
                    },
                ],
            },
        ]
    }
}