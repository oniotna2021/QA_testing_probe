import styled from '@emotion/styled';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 25% 75%;
  grid-column-gap: 20px;
  height: 100%;
  width: 100%;
`;

export const LetftPanel = styled.div`
  background-color: transparent;
  padding: 20px;
  & h1{
    font-size: 15px;
  }
  & p{
    font-size: 12px;
  }
`;


export const RightPanel = styled.div`
  background-color: white;
  padding: 20px;
`;