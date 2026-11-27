import { Route, Routes } from "react-router-dom";
import Auth from "../Pages/Auth.jsx";
import Browse from "../Pages/Browse.jsx";
import ClubForm from "../Pages/ClubForm.jsx";
import CreateEvent from "../Pages/CreateEvent.jsx";
import EventDetails from "../Pages/EventDetails.jsx";
import NotFound from "../Pages/NotFound.jsx";
import SavedEvents from "../Pages/SavedEvents.jsx";

function AppRoutes() {
  // React Router renders the matching page component for the current URL.
  return (
    <Routes>
      <Route path="/" element={<Browse />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/saved" element={<SavedEvents />} />
      <Route path="/create" element={<CreateEvent />} />
      <Route path="/clubs/new" element={<ClubForm />} />
      <Route path="/clubs/:id/edit" element={<ClubForm />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
