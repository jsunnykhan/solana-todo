export const authorFilter = (authorBase58PublicKey: string) => ({
  memcmp: {
    offset: 8,
    bytes: authorBase58PublicKey,
  },
});
