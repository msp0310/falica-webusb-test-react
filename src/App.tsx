import "./App.css";
import { FelicaCommunicator } from "./lib/felica-webusb";
import { useState } from "react";
import { PollingResponse } from "./lib/felica-webusb/FelicaCommunicator";

function App() {
  const [idm, setIdm] = useState<string>();
  const [response, setResponse] = useState<PollingResponse>();
  const [felicaCommunicator, setFelicaCommunicator] =
    useState<FelicaCommunicator>();
  const [readWithoutEncryptionResponse, setReadWithoutEncryptionResponse] =
    useState<Uint8Array[] | undefined>();

  const [byte1, setByte1] = useState<number>(0);
  const [byte2, setByte2] = useState<number>(0);
  const [byte3, setByte3] = useState<number>(0);
  const [byte4, setByte4] = useState<number>(0);
  const [byte5, setByte5] = useState<number>(0);
  const [byte6, setByte6] = useState<number>(0);
  const [byte7, setByte7] = useState<number>(0);
  const [byte8, setByte8] = useState<number>(0);
  const [byte9, setByte9] = useState<number>(0);
  const [byte10, setByte10] = useState<number>(0);
  const [byte11, setByte11] = useState<number>(0);
  const [byte12, setByte12] = useState<number>(0);
  const [byte13, setByte13] = useState<number>(0);
  const [byte14, setByte14] = useState<number>(0);
  const [byte15, setByte15] = useState<number>(0);
  const [byte16, setByte16] = useState<number>(0);

  const polling = async () => {
    const type_f_tag = await FelicaCommunicator.connect();
    const result = await type_f_tag.polling();
    setFelicaCommunicator(type_f_tag);

    setResponse(result);
    setIdm(result.idm);
  };

  const readWithoutEncryption = async () => {
    var result = await felicaCommunicator?.readWithoutEncryption(
      response?.idmRaw as Uint8Array,
      0
    );
    setReadWithoutEncryptionResponse(result?.blockData);
    const json = JSON.stringify(result, null, "\t");
    console.log(json);
  };

  const writeWithoutEncryption = async () => {
    const writeBlockData = [
      byte1,
      byte2,
      byte3,
      byte4,
      byte5,
      byte6,
      byte7,
      byte8,
      byte9,
      byte10,
      byte11,
      byte12,
      byte13,
      byte14,
      byte15,
      byte16,
    ];

    var result = await felicaCommunicator?.writeWithoutEncryption(
      response?.idmRaw as Uint8Array,
      0,
      Uint8Array.of(...writeBlockData)
    );
    const json = JSON.stringify(result, null, "\t");
    console.log(json);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-6xl font-bold underline leading-normal mt-0 mb-2">
          Felica-LiteS Test With WebUSB
        </h1>

        <div className="pb-4">
          <div className="flex items-center">
            <span className="pr-4">{idm ? <>IDm: {idm}</> : null}</span>
            <button
              onClick={polling}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Polling
            </button>
          </div>
        </div>

        <div className="pb-4">
          <span className="pr-4">
            BlockData: {readWithoutEncryptionResponse}
          </span>
          <button
            onClick={readWithoutEncryption}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={idm == null}
          >
            Read
          </button>
        </div>

        <div className="pb-4">
          <div className="pb-4">
            <p>Write Block Data:</p>
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              value={byte1}
              onChange={(e) => setByte1(parseInt(e.target.value))}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              value={byte2}
              onChange={(e) => setByte2(parseInt(e.target.value))}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              value={byte3}
              onChange={(e) => setByte3(parseInt(e.target.value))}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              value={byte4}
              onChange={(e) => setByte4(parseInt(e.target.value))}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte5(parseInt(e.target.value))}
              value={byte5}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte6(parseInt(e.target.value))}
              value={byte6}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte7(parseInt(e.target.value))}
              value={byte7}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte8(parseInt(e.target.value))}
              value={byte8}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte9(parseInt(e.target.value))}
              value={byte9}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte10(parseInt(e.target.value))}
              value={byte10}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte11(parseInt(e.target.value))}
              value={byte11}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte12(parseInt(e.target.value))}
              value={byte12}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte13(parseInt(e.target.value))}
              value={byte13}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte14(parseInt(e.target.value))}
              value={byte14}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte15(parseInt(e.target.value))}
              value={byte15}
            />
            <input
              type="text"
              className="w50 mr-1 text-black text-center"
              onChange={(e) => setByte16(parseInt(e.target.value))}
              value={byte16}
            />

            <button
              onClick={writeWithoutEncryption}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={idm == null}
            >
              Write
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
