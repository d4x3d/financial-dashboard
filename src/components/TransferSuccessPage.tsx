import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { motion } from "framer-motion";

export default function TransferSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [transferDetails, setTransferDetails] = useState({
    id: "",
    date: "",
    amount: "",
    institutionName: "",
    routingNumber: "",
    accountNumber: "",
  });

  useEffect(() => {
    // Get transfer details from location state
    const state = location.state as any;
    if (!state) {
      navigate("/dashboard");
      return;
    }

    const id = state.id || `TRF${Date.now().toString(36).substring(0, 8).toUpperCase()}`;
    const amount = state.amount || "0";
    const institutionName = state.bankName || "Unknown Institution";
    const routingNumber = state.routingNumber || "XXXXXXXX";
    const accountNumber = state.accountNumber || "XXXXXXXX";

    // Format date
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Only set state once when component mounts or URL params change
    setTransferDetails({
      id,
      date: formattedDate,
      amount: `$${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      institutionName,
      routingNumber,
      accountNumber,
    });
  }, [location.state, navigate]);

  return (
    <DashboardLayout>
      <div className="p-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-lg font-medium">Transfer Successful!</AlertDescription>
          </Alert>

          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
          </div>

          <Card className="overflow-hidden border-2 border-green-100 shadow-lg">
            <div className="bg-green-50 p-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-green-800 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" /> Transfer Details
              </h2>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Transaction ID</div>
                <div className="p-4 text-right">{transferDetails.id}</div>
              </div>

              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Date</div>
                <div className="p-4 text-right">{transferDetails.date}</div>
              </div>

              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Type</div>
                <div className="p-4 text-right text-green-600">Transfer</div>
              </div>

              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Amount</div>
                <div className="p-4 text-right text-green-600">{transferDetails.amount}</div>
              </div>

              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Institution Name</div>
                <div className="p-4 text-right">{transferDetails.institutionName}</div>
              </div>

              <div className="grid grid-cols-[auto_1fr] border-b">
                <div className="p-4 font-medium bg-gray-50">Routing Number</div>
                <div className="p-4 text-right">{transferDetails.routingNumber}</div>
              </div>

              <div className="grid grid-cols-[auto_1fr]">
                <div className="p-4 font-medium bg-gray-50">Account Number</div>
                <div className="p-4 text-right">••••{transferDetails.accountNumber.slice(-4)}</div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
