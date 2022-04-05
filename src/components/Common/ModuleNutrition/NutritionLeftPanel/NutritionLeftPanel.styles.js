import styled from '@emotion/styled';

export const Container = styled.div`
  & h1{
    margin: 10px 0 10px 0;
    font-weight: 600;
    font-size: 1rem;
  }
  & p{
    margin: 10px 0 10px 0;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  & img{
    width:  50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
  & h2{
    margin: 0;
    font-size: .8rem;
  }
  & span{
    font-size: .8rem;
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  & > *{
    margin-top: 40px;
    width: 167px;
  }
`;
