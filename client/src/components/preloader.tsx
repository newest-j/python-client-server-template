import { useEffect, useState } from "react";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="text-red-900">Loading application ....</div>;
  }
  return children;
}

export default AppInitializer;
