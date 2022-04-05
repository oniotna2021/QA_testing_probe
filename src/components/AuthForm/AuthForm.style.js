import styled from '@emotion/styled';

export const AuthFormContainer = styled.div`
  max-height: 100vh;
  display: flex;
  justify-content: space-between;
  animation: fadein 0.5s;
  background-color: white;
  @media screen and (max-width: 414px) {
    display: none;
  }
`;


export const AuthFormContent = styled.div`
  overflow-y: auto;
  flex: 1;
  margin-top: 150px;
  border-radius: 20px 0px 0px 20px;
`;

export const AuthFormImage = styled.img`
  height: 100vh;
  object-fit: cover;
  width: 412px;
`;


export const Footer = styled.div`
    top: 100%;
    transform: translateY(-100%);
    position: sticky;
  p{
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    color: #3C3C3B;
    opacity: 0.6;
  }
`;




