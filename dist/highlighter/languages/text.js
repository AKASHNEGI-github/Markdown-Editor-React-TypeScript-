export const text = {
    name: "Plain Text",
    aliases: ["text", "txt", "plaintext", "plain", "none"],
    tokenize: (code) => [{ type: "plain", text: code }],
};
