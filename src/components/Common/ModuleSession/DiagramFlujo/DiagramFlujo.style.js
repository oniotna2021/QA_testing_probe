import styled from '@emotion/styled';


export const DefaultOptions = styled.div`
  align-items: center;
  cursor: pointer;
  position: absolute;
  z-index: 99;
  margin: 100px 20px;
  display:   ${props => (props.isViewOptionsSecondary ? 'flex' : 'none')};
`;
