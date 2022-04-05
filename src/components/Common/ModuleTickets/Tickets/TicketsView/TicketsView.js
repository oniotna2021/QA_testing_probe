import { useState, useEffect } from "react";

// imports
import { useSnackbar } from "notistack";

// styled components
import { Main } from "./TicketsView.styled";

// services
import { getAllTickets } from "services/Tickets/tickets";

// components
import Loading from "components/Shared/Loading/Loading";

// utils
import { errorToast, mapErrors } from "utils/misc";

const TicketsView = () => {
  // loading
  const [isLoading, setIsLoading] = useState(true);
  // errors
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsLoading(true);
    const fetchAllTickets = async () => {
      try {
        const data = await getAllTickets();
        console.log(data.data);
      } catch (err) {
        enqueueSnackbar(mapErrors(err), errorToast);
      }
      setIsLoading(true); //cambiar
    };
    fetchAllTickets();
  }, []);

  return (
    <Main>
      {/* menu superior */}
      <div className="container options">{isLoading && <Loading />}</div>
      {/* lista de tickets */}
      <div className="container ticketList">{isLoading && <Loading />}</div>
      {/* contenido de tickets */}
      <div className="container ticketContent">{isLoading && <Loading />}</div>
    </Main>
  );
};

export default TicketsView;
