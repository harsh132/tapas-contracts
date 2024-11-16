"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, QrCode, Wifi, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

export default function PayPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [amount, setAmount] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = () => {
    setIsScanning(true);
    setCameraOpen(true);
  };

  const handleTap = () => {
    setAmount("30.00"); // Example tapped amount
    setShowConfirmation(true);
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
    if (cameraOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera", err);
          setCameraOpen(false);
          setIsScanning(false);
        });

      // Simulating a QR code scan after 5 seconds
      const timer = setTimeout(() => {
        setAmount("25.00");
        stopCamera();
        setShowConfirmation(true);
      }, 5000);

      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }
  }, [cameraOpen]);

  const ConfirmationScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8 text-primary"
      >
        <CheckCircle className="h-24 w-24" />
      </motion.div>
      <h2 className="mb-4 text-3xl font-bold">Payment Successful!</h2>
      <Card className="mb-8 w-full max-w-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-bold">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <span>Merchant Name</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-sm">TXN123456789</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={() => setShowConfirmation(false)}
        className="w-full max-w-sm"
      >
        Back to Pay
      </Button>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center border-b p-4">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Pay</h1>
      </header>

      <main className="container mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-8">
        <Card className="mb-8 w-full">
          <CardContent className="p-6">
            <div className="mb-2 text-center text-4xl font-bold">
              ${amount || "0.00"}
            </div>
            <div className="text-center text-muted-foreground">
              {amount ? "Amount to pay" : "Scan or tap to set amount"}
            </div>
          </CardContent>
        </Card>

        <div className="grid w-full grid-cols-2 gap-4">
          <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
            <Button
              className="flex h-32 flex-col items-center justify-center text-xl"
              onClick={handleScan}
            >
              <QrCode className="mb-2 h-12 w-12" />
              {isScanning ? "Scanning..." : "Scan QR"}
            </Button>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary opacity-50" />
              </div>
              <Button onClick={stopCamera}>Cancel</Button>
            </DialogContent>
          </Dialog>

          <Button
            className="flex h-32 flex-col items-center justify-center text-xl"
            onClick={handleTap}
          >
            <Wifi className="mb-2 h-12 w-12" />
            Tap to Pay
          </Button>
        </div>
      </main>

      <AnimatePresence>
        {showConfirmation && <ConfirmationScreen />}
      </AnimatePresence>
    </div>
  );
}
