import { IColumnConfig, ITableConfig } from "~/common/types";

export function findWithAttr<T>(array: T[], attr: keyof T, value: T[keyof T]): T | null {
  if (!array?.length) return null;
  for (let i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return array[i];
      }
    }
    return null;
  }

export function getTableFor(tables: ITableConfig[], tableName: string) : ITableConfig | null {
  return findWithAttr(tables, "name", tableName)
}

export function getColumnsFor(tables: ITableConfig[], tableName: string): IColumnConfig[] {
    return getTableFor(tables, tableName)?.columns ?? []
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
}