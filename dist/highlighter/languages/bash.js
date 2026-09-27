import { buildRules, kwSet } from "../engine.js";
const keywords = kwSet([
    "if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case", "esac",
    "function", "in", "return", "exit", "export", "local", "readonly", "echo", "cd",
    "source", "alias", "unset", "shift", "break", "continue", "set",
]);
export const bash = {
    name: "Bash",
    aliases: ["bash", "sh", "shell", "zsh", "console"],
    rules: buildRules({
        lineComment: ["#"],
        strings: [/"(?:\\.|[^"\\\n])*"/y, /'[^'\n]*'/y],
        keywords,
        extraRules: [
            { type: "variable", re: /\$\{[^}]*\}/y },
            { type: "variable", re: /\$[A-Za-z_][A-Za-zA-Z0-9_]*/y },
            { type: "variable", re: /\$[0-9@#?*$!-]/y },
        ],
    }),
};
