import styled from "@emotion/styled";

// ui
import Button from "@material-ui/core/Button";

export const CardAfiliate = styled.div`
  background: #f9f9f9;
  margin: 1.5em 0em;
  border-radius: 12px;

  .CardAfiliate-content {
    padding: 1em;
  }
  .CardAfiliate-title {
    color: #3c3c3b;
    font-size: 12px;
    font-weight: 500;
  }

  p {
    margin: 0.4em 0.2em;
  }
`;

export const ButtonDetail = styled(Button)`
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  background-color: #f3f3f3;
  cursor: pointer;
  margin: 0 10px;

  :hover {
    background-color: #b7cbca;
  }
`;

export const ButtonAssign = styled(Button)`
  width: 180px;
  color: #ffffff;
  background: #007771;
  border-radius: 10px;

  :hover {
    background: #007771;
  }
`;
