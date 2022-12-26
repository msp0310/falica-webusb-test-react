/**
 * コマンドコード
 */
export const CommandCodes = {
  RequestPolling: 0x00,
  ResponsePolling: 0x01,
  RequestReadWithoutEncryption: 0x06,
  ResponseReadWithoutEncryption: 0x07,
  RequestWriteWithoutEncryption: 0x08,
  ResponseWriteWithoutEncryption: 0x09,
} as const;
