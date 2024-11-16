"use client";
import { useEffect, useState } from "react";
import * as halo from "src/lib/halo";
import * as viem from "viem";

export default function HomePage() {
  const [nfcPermission, setNfcPermission] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  async function checkWebNFCPermission() {
    await halo.checkPermission().then(() => setNfcPermission(true));
  }

  async function testHalo() {
    const digest = "51605c863fc00650aa9965d4bd8b2838a9ff116fe6ae680da18d869cf7281f29";

    const info = await halo.getKeys();
    setLogs((prevLogs) => [...prevLogs, JSON.stringify(info, null, 2)]);

    void halo.signDigest(digest).then((response) => {
      setLogs((prevLogs) => [...prevLogs, JSON.stringify(response, null, 2)]);
      void viem.recoverAddress({
        hash: "0x51605c863fc00650aa9965d4bd8b2838a9ff116fe6ae680da18d869cf7281f29",
        signature: response.signature.ether
      }).then((address) => {
        const log = JSON.stringify({ recoverdAddress: address }, null, 2);
        setLogs((prevLogs) => [...prevLogs, log]);
      });
    });
  }

  useEffect(() => {
    void checkWebNFCPermission();
  }, []);

  return (
    <main className="">
      <h1>Hardware Test</h1>
      {nfcPermission ? "Web NFC is enabled" : "Web NFC is disabled"}
      <br />
      <button onClick={testHalo} style={{ backgroundColor: "gray" }}>Test Halo</button>
      <br /><br /><br />
      <div>{logs.map((l, i) => {
        return <p key={i}>{l} <br /></p>
      })}</div>
    </main>
  );
}
