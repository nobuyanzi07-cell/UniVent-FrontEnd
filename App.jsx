import { BrowserRouter, Routes, Route } from "react-router-dom";

import Browse from "./pages/Browse";
import EventDetails from "./pages/EventDetails";
import SavedEvents from "./pages/SavedEvents";
import CreateEvent from "./pages/CreateEvent";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/saved" element={<SavedEvents />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
