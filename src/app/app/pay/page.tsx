"use client";

import { ArrowLeft, CheckCircle, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

export default function PayPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const amount = searchParams.get("amount");
    const to = searchParams.get("to");
    if (amount && to) {
      setAmount(amount);
      setRecipient(to);
      setCameraOpen(false);
    }
  }, [searchParams]);

  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  const scanner = useRef<QrScanner>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTap = () => {
    setAmount("30.00"); // Example tapped amount
    setShowConfirmation(true);
  };

  const enableCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraOpen(true);
        setIsScanning(true);
      })
      .catch((err) => {
        console.error("Error accessing the camera", err);
        setCameraOpen(false);
        setIsScanning(false);
      });
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraOpen(false);
    setIsScanning(false);
  };

  useEffect(() => {
    if (!showConfirmation && !amount && !recipient)
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraOpen(true);
          setIsScanning(true);
        })
        .catch((err) => {
          console.error("Error accessing the camera", err);
          setCameraOpen(false);
          setIsScanning(false);
        });

    return () => {
      stopCamera();
    };
  }, [amount, recipient, showConfirmation]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);

    setScannedResult(result.data);
    window.alert(result.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoRef?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoRef?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setIsScanning(true))
        .catch((err) => {
          if (err) setIsScanning(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      scanner?.current?.stop();
    };
  }, []);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full flex-1 flex-col gap-8 py-8">
        <header className="relative grid grid-cols-[3rem_auto_3rem] items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-center text-xl font-bold leading-none">Pay</h1>

          <div className=""></div>
        </header>

        <div className="tapas-gradient-text text-center text-6xl font-bold">
          $ {amount || "0.00"}
        </div>

        <div className="tapas-gradient relative mx-auto h-64 w-64 rounded-3xl p-[2px]">
          <div className="absolute left-[-2px] top-[-2px] z-[0] m-1 h-[calc(100%_-_4px)] w-[calc(100%_-_4px)] rounded-[calc(1.5rem_-_2px)] bg-background/50"></div>

          <div className="absolute left-[-2px] top-[-2px] z-[0] m-1 flex h-[calc(100%_-_4px)] w-[calc(100%_-_4px)] items-center justify-center overflow-hidden rounded-[calc(1.5rem_-_2px)] bg-background/50">
            {isScanning && cameraOpen ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="m-[1px] h-64 w-full rounded-[calc(1.5rem_-_2px)] object-cover"
              />
            ) : (
              <Button onClick={() => enableCamera()}>Enable Camera</Button>
            )}
          </div>
        </div>

        <Button
          className="mt-auto flex h-24 flex-col items-center justify-center text-xl"
          onClick={handleTap}
        >
          <Wifi className="h-12 w-12" />
          Tap to Pay
        </Button>

        <Button
          onClick={() => setShowConfirmation(true)}
          className="mt-auto flex h-24 flex-col items-center justify-center text-xl"
        >
          Open
        </Button>

        <AnimatePresence>
          {(showConfirmation || (recipient && amount)) && (
            <ConfirmationScreen
              timestamp={"timestamp"}
              amount={amount}
              recipient={recipient}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ConfirmationScreen = ({
  recipient,
  amount,
  timestamp,
}: {
  recipient: string;
  amount: string;
  timestamp: string;
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex w-full flex-col items-center justify-center bg-background py-8"
    >
      <header className="relative grid w-full grid-cols-[3rem_auto_3rem] items-center">
        <div className=""></div>

        <h1 className="text-center text-xl font-bold leading-none">
          Payment Completed!
        </h1>

        <div className=""></div>
      </header>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 5 }}
        className="mb-8 text-primary"
      >
        <CheckCircle className="h-24 w-24" />
      </motion.div>

      <div className="flex w-full flex-col gap-4 pt-8">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-bold">${amount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">To</span>
          <span>{recipient}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span>{timestamp}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="font-mono text-sm">0x00000</span>
        </div>
      </div>

      <Button
        className="mt-auto w-full"
        onClick={() => router.push("/app/home")}
      >
        Close
      </Button>
    </motion.div>
  );
};
