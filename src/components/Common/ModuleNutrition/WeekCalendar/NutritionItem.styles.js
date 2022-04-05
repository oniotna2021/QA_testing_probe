import Styled from "@emotion/styled";

export const Container = Styled.table`
    padding: 5px;
    position: relative;
    background-color: ${({ isVirtualUser }) =>
      isVirtualUser ? "#E6F1F1" : "rgba(98, 149, 250, .2)"};
    width: 100%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & img{
        width: 35px;
        height: 35px;
        border-radius: 50%;
        object-fit: cover;
    }
    & h1{
        font-size: .6rem;
        margin: 5px 0 0 0;
        text-align: center;
    }
    & span{
        font-size: .6rem;
    }
    z-index: 1;
`;

export const DeleteButton = Styled.div`
    background-color: transparent;
    border: none;
    position: absolute;
    right: 5px;
    top: 0px;
    color: gray;
    cursor: pointer;
    z-index: 2;
    pointer-events: all;
`;
