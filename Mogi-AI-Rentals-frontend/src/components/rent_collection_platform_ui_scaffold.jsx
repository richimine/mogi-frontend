import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, CreditCard, Home, BarChart } from "lucide-react";

export default function RentPlatformUI() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md p-4 mb-6 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold">RentFlow AI</h1>
        <Button className="rounded-2xl">Dashboard</Button>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["Total Rent", "Paid", "Pending", "Tenants"].map((title, i) => (
          <Card key={i} className="rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{title}</p>
              <h2 className="text-xl font-semibold">Ksh 45,000</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard /> Invoices
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Unit A1 - July</span>
                  <Button size="sm">Pay</Button>
                </li>
                <li className="flex justify-between">
                  <span>Unit B2 - July</span>
                  <Button size="sm" variant="outline">Paid</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl shadow-md h-full">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle /> Tenant Chat
              </h3>
              <div className="bg-gray-50 rounded-xl p-3 h-40 overflow-y-auto mb-3">
                <p className="text-sm">Tenant: Water issue in Unit A1</p>
                <p className="text-sm text-right">You: Plumber will come tomorrow</p>
              </div>
              <input 
                className="w-full p-2 rounded-xl border"
                placeholder="Type message..." 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="rounded-2xl shadow-md h-full">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Home /> AI Assistant
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                How can I assist with your property management today?
              </p>
              <Button className="w-full">Ask AI</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8"
      >
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <BarChart /> Revenue Overview
            </h3>
            <div className="h-40 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </motion.section>

    </div>
  );
}
