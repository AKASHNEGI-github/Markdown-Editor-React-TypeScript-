import { buildRules, kwSet } from "../engine.js";
export const json = {
    name: "JSON",
    aliases: ["json", "jsonc"],
    rules: buildRules({
        strings: [/"(?:\\.|[^"\\\n])*"/y],
        keywords: kwSet(["null"]),
        booleans: kwSet(["true", "false"]),
    }),
};
