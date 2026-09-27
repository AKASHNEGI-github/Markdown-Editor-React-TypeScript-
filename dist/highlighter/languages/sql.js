import { buildRules, kwSet } from "../engine.js";
const keywords = kwSet([
    "select", "from", "where", "insert", "into", "values", "update", "set", "delete",
    "create", "table", "alter", "drop", "join", "left", "right", "inner", "outer",
    "on", "group", "by", "order", "having", "limit", "as", "and", "or", "not", "null",
    "is", "in", "like", "between", "union", "distinct", "count", "sum", "avg", "max",
    "min", "primary", "key", "foreign", "references", "default", "index", "view",
    "with", "case", "when", "then", "end", "asc", "desc",
], true);
export const sql = {
    name: "SQL",
    aliases: ["sql"],
    rules: buildRules({
        lineComment: ["--"],
        blockComment: [["/*", "*/"]],
        strings: [/'(?:\\.|[^'\\\n])*'/y],
        keywords,
        caseInsensitiveKeywords: true,
    }),
};
