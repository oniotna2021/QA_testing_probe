import styled from "@emotion/styled";

export const Point = styled.div`
  background: ${({ color }) => color};
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

export const Box = styled.div`
  header {
    border-bottom: none;
  }
`;

export const Table = styled.div`
  display: flex;
`;

export const TableCol = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 45px);
  grid-template-rows: 100px 18px 18px;
`;

export const TableCel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BoxPoint = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
`;

export const Text = styled.p`
  margin: -1em 0.5em 0.7em 0.5em;
`;
