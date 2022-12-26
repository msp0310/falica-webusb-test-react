import { CommandCodes } from "./CommandCodes";
import { RCS380 } from "./RCS380";
import { ReceivedPacket } from "./RCS380Packet";

export class FelicaCommunicator {
  private protocol = Uint8Array.of(0x00, 0x18);
  private rf = Uint8Array.of(0x01, 0x01, 0x0f, 0x01);

  constructor(readonly rcs380: RCS380) {}

  public static async connect(): Promise<FelicaCommunicator> {
    const device = await RCS380.connect();
    return new FelicaCommunicator(device);
  }

  /**
   * Polling
   * @returns
   */
  public async polling(): Promise<PollingResponse> {
    await this.rcs380.initDevice();
    const result = await this.findTypeFTag();
    await this.rcs380.disconnect();

    console.log(
      `response>>> bytes: ${result.toHexString()} length:${result.length}`
    );
    return {
      responseCode: result.slice(8, 9)[0],
      idm: result.slice(9, 17).toHexString(),
      idmRaw: result.slice(9, 17),
      pmm: result.slice(17, 17 + 8).toHexString(),
      pmmRaw: result.slice(17, 17 + 8),
    };
  }

  /**
   * Read Without Encryption
   * @param idm
   * @param blockNumber
   * @returns
   */
  public async readWithoutEncryption(idm: Uint8Array, blockNumber: number) {
    // 初期化
    await this.rcs380.initDevice();

    // Type-F判別コマンド
    const command = Uint8Array.of(
      // コマンドコード
      CommandCodes.RequestReadWithoutEncryption,
      ...idm, // IDm
      // サービスコード
      0x01, // サービス数
      0x0b, // サービスコードリスト
      0x00,
      // ブロックエレメント
      0x01, // ブロック数
      0x80,
      blockNumber
    );

    const payload = Uint8Array.of(command.byteLength + 1, ...command);

    var result = await this.rcs380.inCommRf(payload, 0.01);
    await this.rcs380.disconnect();

    const chunk = ([...array], size = 1) => {
      return array.reduce(
        (acc, value, index) =>
          index % size ? acc : [...acc, array.slice(index, index + size)],
        []
      );
    };

    const packet = result.data.slice(8);
    return {
      responseCode: packet[0],
      idm: packet.slice(1, 9).toHexString(),
      idmRaw: packet.slice(1, 9),
      statusFlag1: packet.slice(9, 9)[0],
      statusFlag2: packet.slice(10, 10)[0],
      blockSize: packet.slice(11, 11)[0],
      blockData: chunk(packet.slice(12), 16),
    } as ReadWithoutEncryptionResponse;
  }

  /**
   * Write Without Encryption
   * @param idm IDm
   * @param blockNumber
   * @param value
   * @returns
   */
  public async writeWithoutEncryption(
    idm: Uint8Array,
    blockNumber: number,
    value: Uint8Array
  ) {
    // 初期化
    await this.rcs380.initDevice();

    const command = Uint8Array.of(
      // コマンドコード
      CommandCodes.RequestWriteWithoutEncryption,
      ...idm, // IDm
      // サービスコード
      0x01, // サービス数
      0x09, // サービスコードリスト
      0x00,
      // ブロックエレメント
      0x01, // ブロック数
      0x80, // ブロックリスト
      blockNumber,
      ...value
    );

    const payload = Uint8Array.of(command.byteLength + 1, ...command);

    var result = await this.rcs380.inCommRf(payload, 0.01);
    await this.rcs380.disconnect();

    const packet = result.data.slice(8);
    return {
      responseCode: packet[0],
      idm: packet.slice(1, 9).toHexString(),
      idmRaw: packet.slice(1, 9),
      statusFlag1: packet.slice(10, 11)[0],
      statusFlag2: packet.slice(11, 12)[0],
    } as WriteWithoutEncryptionResponse;
  }

  private async sendSenseTypeFCommand(): Promise<ReceivedPacket> {
    // Type-F判別コマンド
    const command = Uint8Array.of(
      CommandCodes.RequestPolling,
      0xff,
      0xff,
      0x01,
      0x00
    );
    // コマンドの先頭に`コマンド長+1`を数値で指定する必要があるらしい
    const payload = Uint8Array.of(command.byteLength + 1, ...command);
    // Type-F判別コマンドの送信
    return this.rcs380.inCommRf(payload, 0.01);
  }

  private async findTypeFTag(): Promise<Uint8Array> {
    console.info("Find Type-F tag");
    let data = new Uint8Array(0);

    // IDmが取得できるまで無限ループ
    while (true) {
      // IDm/PMm取得コマンドの発行
      await this.rcs380.sendPreparationCommands(this.rf, this.protocol);
      const result = await this.sendSenseTypeFCommand();
      data = result.data;

      // パケットの本体部分だけ取っておく
      if (result.payload.byteLength === 37) {
        // IDmが取得できた場合ループから抜ける
        break;
      }
    }

    return data;
  }
}

export interface PollingResponse {
  responseCode: number;
  idm: string;
  idmRaw: Uint8Array;
  pmm: string;
  pmmRaw: Uint8Array;
}

export interface ReadWithoutEncryptionResponse {
  responseCode: number;
  idm: string;
  idmRaw: Uint8Array;
  statusFlag1: number;
  statusFlag2: number;
  blockSize: number;
  blockData: Array<Uint8Array>;
}

export interface WriteWithoutEncryptionResponse {
  responseCode: number;
  idm: string;
  idmRaw: Uint8Array;
  statusFlag1: number;
  statusFlag2: number;
}
