"use client";

import { useState } from "react";
import { ArrowLeft, Edit2, QrCode, Wifi } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function MerchantPayment() {
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNumberClick = (num: string) => {
    if (amount.includes(".") && amount.split(".")[1]?.length === 2) return;
    setAmount((prev) => {
      if (num === "." && prev.includes(".")) return prev;
      if (num === "." && prev === "") return "0.";
      return prev + num;
    });
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsConfirmed(true);
    }
  };

  const handleEdit = () => {
    setIsConfirmed(false);
  };

  const handleBack = () => {
    setAmount("");
    setIsConfirmed(false);
  };

  const numpadButtons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "del",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="container mx-auto max-w-md flex-1 px-4 py-8">
        {!isConfirmed ? (
          <>
            <h1 className="mb-6 text-2xl font-bold">Enter Payment Amount</h1>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center text-4xl font-bold">
                  ${amount || "0.00"}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {numpadButtons.map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "del" ? "destructive" : "outline"}
                  className="h-16 text-2xl"
                  onClick={() =>
                    btn === "del" ? handleDelete() : handleNumberClick(btn)
                  }
                >
                  {btn === "del" ? "⌫" : btn}
                </Button>
              ))}
            </div>
            <Button
              className="mt-6 h-16 w-full text-xl"
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) === 0}
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold">Payment Details</h1>
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Edit2 className="h-6 w-6" />
              </Button>
            </div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-4 text-center text-4xl font-bold">
                  ${parseFloat(amount).toFixed(2)}
                </div>
                <div className="flex justify-center space-x-4">
                  <QrCode className="h-32 w-32" />
                </div>
              </CardContent>
            </Card>
            <Button className="mb-4 h-16 w-full text-xl">
              <Wifi className="mr-2 h-8 w-8" />
              Tap to Pay
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
