import { useParams } from "react-router-dom";
import PlaceholderPage from "./PlaceholderPage.jsx";

function EventDetails() {
  const { id } = useParams();

  return (
    <PlaceholderPage
      title="Event details"
      description={`Details for event ${id} will appear here.`}
    />
  );
}

export default EventDetails;