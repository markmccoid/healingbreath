import React, { useState, useCallback } from "react";
const useComponentSize = () => {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

export default useComponentSize;
