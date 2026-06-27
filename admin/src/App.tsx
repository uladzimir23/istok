import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { pb, logout } from "./lib/pb";
import { Shell } from "./components/Shell";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { ProductEdit } from "./pages/ProductEdit";

export function App() {
  const [authed, setAuthed] = useState(pb.authStore.isValid);

  useEffect(() => {
    return pb.authStore.onChange(() => setAuthed(pb.authStore.isValid));
  }, []);

  if (!authed) return <Login />;

  return (
    <BrowserRouter>
      <Shell onLogout={logout}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products/:id" element={<ProductEdit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
