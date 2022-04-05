import styled from "@emotion/styled";

// ui
import Button from "@material-ui/core/Button";

export const Point = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50px;
  margin-right: 1em;
  background: ${(props) => (props.active ? "#94C97A " : "#E5E5E5")};
`;

export const WithoutTrainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 30px;
  background: #f7c3c3;
  border-radius: 8px;

  p {
    font-weight: bold;
  }
`;

export const ButtonDetail = styled(Button)`
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  background-color: #cce4e3;
  cursor: pointer;
  margin: 0 10px;

  :hover {
    background-color: #b7cbca;
  }
`;
