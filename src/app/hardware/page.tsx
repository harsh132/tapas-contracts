"use client";
import { useEffect, useState } from "react";
import * as halo from "@arx-research/libhalo/api/web";
import { set } from "zod";

export default function HomePage() {
  const [nfcPermission, setNfcPermission] = useState(false);
  const [logs, setLogs] = useState("");

  async function checkWebNFCPermission() {
    await halo.haloCheckWebNFCPermission().then(() => setNfcPermission(true));
  }

  async function testHalo() {
    const command = {
      name: "sign",
      keyNo: 1,
      // message: "010203",
      digest: "51605c863fc00650aa9965d4bd8b2838a9ff116fe6ae680da18d869cf7281f29"
      /* uncomment the line below if you get an error about setting "command.legacySignCommand = true" */
      // legacySignCommand: true,
    };

    void halo.execHaloCmdWeb(command).then((response) => {
      setLogs(JSON.stringify(response, null, 2));
    });
  }

  useEffect(() => {
    // void checkWebNFCPermission();
  }, []);

  return (
    <main className="">
      <h1>Hardware Test</h1>
      {nfcPermission ? "Web NFC is enabled" : "Web NFC is disabled"}
      <br />
      <button onClick={testHalo} style={{ backgroundColor: "gray" }}>Test Halo</button>
      <br /><br /><br />
      <div>{logs}</div>
    </main>
  );
}
