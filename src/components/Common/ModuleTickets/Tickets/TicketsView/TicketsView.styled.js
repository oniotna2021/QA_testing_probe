import styled from "@emotion/styled";

export const Main = styled.div`
  background-color: #ffffff;
  height: 900px;
  display: grid;
  grid-gap: 20px;
  border-radius: 20px;
  padding: 20px;
  grid-template-areas: "options options" "ticketList ticketContent";
  grid-template-rows: 70px auto;
  grid-template-columns: 30% auto;

  .container {
    width: 100%;
    height: 100%;
    border: 1px solid orange;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .options {
    grid-area: options;
  }

  .ticketList {
    grid-area: ticketList;
  }

  .ticketContent {
    grid-area: ticketContent;
  }
`;
