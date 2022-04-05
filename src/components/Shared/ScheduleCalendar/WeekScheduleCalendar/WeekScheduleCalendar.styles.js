import styled from "@emotion/styled";

export const TableLTR = styled.div`
  position: relative;
  overflow: hidden;
  direction: ltr;
  height: 100%;
`;

export const ScrollContainer = styled.div`
  overflow: hidden scroll;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

export const ContainerTableRelative = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100%;
  width: 100%;
`;

export const ContainerAbsolute = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

export const TDGridCell = styled.td`
  border: 1px solid #ddd;
  width: 145px;
  background: ${(props) => (props.bgColor ? props.bgColor : "#ffffff")};
`;

export const EventContainer = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const EventItemContainer = styled.div`
  z-index: ${(props) => (props.zIndex ? props.zIndex : "initial")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
