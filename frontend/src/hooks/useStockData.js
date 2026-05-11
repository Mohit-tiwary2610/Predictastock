import { useState, useCallback } from "react";
import { getStockData, getPrediction } from "../utils/api";
import toast from "react-hot-toast";

export default function useStockData() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const fetchStock = useCallback(async (sym, period = "2y") => {
    if (!sym) return;
    
    console.log("[fetchStock] Starting fetch for:", sym);
    setSymbol(sym.toUpperCase());
    setLoading(true);
    setStockData(null);
    setPrediction(null);
    
    try {
      const data = await getStockData(sym.toUpperCase(), period);
      console.log("[fetchStock] Received data:", data);
      
      if (data && data.success !== false) {
        setStockData(data);
        console.log("[fetchStock] Stock data set successfully");
      } else {
        throw new Error(data?.error || "Failed to load stock data");
      }
    } catch (err) {
      console.error("[fetchStock] Error:", err);
      toast.error(`Failed to load ${sym}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const runPrediction = useCallback(async (sym, days = 30) => {
    if (!sym) {
      console.error("[runPrediction] No symbol provided");
      return false;
    }
    
    console.log("[runPrediction] Starting prediction for:", sym, "days:", days);
    setPredicting(true);
    setPrediction(null);
    
    const toastId = toast.loading(`Training LSTM for ${sym}… (30-90 sec)`);
    
    try {
      const data = await getPrediction(sym.toUpperCase(), days);
      console.log("[runPrediction] Received prediction data:", data);
      
      if (data && data.success !== false) {
        setPrediction(data);
        toast.success("Prediction complete! ✅", { id: toastId });
        console.log("[runPrediction] Prediction set successfully:", {
          hasMetrics: !!data.metrics,
          hasFuture: !!data.future,
          futureLength: data.future?.length,
          trend: data.predicted_trend
        });
        return true;
      } else {
        throw new Error(data?.error || "Prediction failed");
      }
    } catch (err) {
      console.error("[runPrediction] Error:", err);
      toast.error(`Prediction failed: ${err.message}`, { id: toastId });
      return false;
    } finally {
      setPredicting(false);
    }
  }, []);

  return {
    symbol,
    setSymbol,
    stockData,
    prediction,
    loading,
    predicting,
    fetchStock,
    runPrediction,
  };
}