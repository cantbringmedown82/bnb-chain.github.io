import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Investors from "./pages/Investors";
import Regulators from "./pages/Regulators";
import Evidence from "./pages/Evidence";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/regulators" element={<Regulators />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/success" element={<div>Subscription successful.</div>} />
        <Route path="/cancel" element={<div>Subscription canceled.</div>} />
      </Routes>
    </BrowserRouter>
  );
}
