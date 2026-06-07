import { useState, useEffect } from "react";

export function useLowDataMode() {
  const [isLowDataMode, setIsLowDataMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("selam_low_data_mode");
    if (stored === "true") {
      setIsLowDataMode(true);
    }
  }, []);

  const toggleMode = () => {
    const newValue = !isLowDataMode;
    setIsLowDataMode(newValue);
    localStorage.setItem("selam_low_data_mode", String(newValue));
  };

  return { isLowDataMode, toggleMode };
}
