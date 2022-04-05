import styled from "@emotion/styled";

// ui
import Button from "@material-ui/core/Button";

export const CardsInfo = styled(Button)`
  display: flex;
  width: 150px;
  align-items: center;
  justify-content: center;
  background: #ececeb;
  border-radius: 10px;

  :hover {
    background: #cdcdcb;
  }

  p {
    font-weight: bold;
    margin: 0em 0.2em;
  }
`;
