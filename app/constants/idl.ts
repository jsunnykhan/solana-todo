export const IDL = {
  version: "0.1.0",
  name: "my_program",
  constants: [
    { name: "USER_TAG", type: { defined: "&[u8]" }, value: 'b"USER_STATE"' },
    { name: "TODO_TAG", type: { defined: "&[u8]" }, value: 'b"TODO_STATE"' },
  ],
  instructions: [
    {
      name: "initializeUser",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "addTodo",
      accounts: [
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "todoAccount", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "content", type: "string" }],
    },
    {
      name: "markTodo",
      accounts: [
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "todoAccount", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "todoIdx", type: "u8" }],
    },
    {
      name: "removeTodo",
      accounts: [
        { name: "userProfile", isMut: true, isSigner: false },
        { name: "todoAccount", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "todoIdx", type: "u8" }],
    },
    {
      name: "updateTodo",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "todoAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "todoIdx", type: "u8" },
        { name: "content", type: "string" },
      ],
    },
  ],
  accounts: [
    {
      name: "UserProfile",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "lastTodo", type: "u8" },
          { name: "todoCount", type: "u8" },
        ],
      },
    },
    {
      name: "TodoAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "idx", type: "u8" },
          { name: "content", type: "string" },
          { name: "marked", type: "bool" },
        ],
      },
    },
  ],
  errors: [{ code: 6000, name: "AlreadyMarked", msg: "Already Marked" }],
};
