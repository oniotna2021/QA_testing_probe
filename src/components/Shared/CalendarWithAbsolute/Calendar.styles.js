import styled from "@emotion/styled";

export const Container = styled.table`
  border-collapse: 0;
  border-spacing: 0px;
  ${({ isMobile }) => (isMobile ? " width: 300px" : " width: 100%")};
  overflow-x: auto;
  display: block;
`;

export const TableBody = styled.tbody`
  td {
    width: 200px;
    height: 70px;
  }
  td:first-child {
    font-size: 0.7rem;
    color: black;
    width: 100%;
  }
`;
