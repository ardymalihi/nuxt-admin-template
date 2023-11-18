# nuxt-admin-template
Nuxt Admin Template


# getting db schema information

``` sql
SELECT
        table_name,
        column_name,
        data_type,
        ordinal_position AS position,
        column_default AS defulat_value,
        is_nullable
      FROM
        information_schema.columns
      WHERE
        table_schema = 'public'
        ORDER BY table_name, ordinal_position;

SELECT
        kcu.table_name,
        kcu.column_name,
        kcu.constraint_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        c.constraint_type
      FROM
        information_schema.key_column_usage kcu
      JOIN
        information_schema.table_constraints c ON kcu.constraint_name = c.constraint_name
      JOIN
        information_schema.constraint_column_usage ccu ON kcu.constraint_name = ccu.constraint_name
      WHERE
        kcu.table_schema = 'public'
        ORDER BY table_name;
```