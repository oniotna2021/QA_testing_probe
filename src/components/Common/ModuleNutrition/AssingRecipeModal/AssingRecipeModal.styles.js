import Styled from "@emotion/styled"

export const Card = Styled.div`
    width: 500px;
    position: absolute;
    top: 50%;  
    left: 50%; 
    transform: translate(-50%, -50%);
    padding: 30px;
    background-color: white;
    border-radius: 15px;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    & h1{
        font-size: 20px;
        margin-bottom: 30px;
    }
    & input {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: solid 1px gray;
        margin-bottom: 10px;
    }
    & select{
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        border: solid 1px gray;
        margin-bottom: 10px;
    }
`;

export const ButtonContainer = Styled.div`
    display: flex;
    justify-content: space around;
    margin: 30px 0 20px 0;
`;

export const CancelButton = Styled.button`
    background-color: white;
    border: none;
    font-size: 15px;
    padding: 10px;
    width: 215px;
    cursor: pointer;
`;

export const AsingButton = Styled.button`
    background-color: #4959A2;
    color: white;
    border: none;
    font-size: 15px;
    padding: 10px;
    width: 215px;
    border-radius: 10px;
    cursor: pointer;
`;

export const SelectContainer = Styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & select{
        width: 210px !important;
        padding: 10px;
        border-radius: 10px;
        border: solid 1px gray;
        margin-bottom: 10px;
    }
`;
