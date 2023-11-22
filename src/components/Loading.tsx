import { styled } from 'styled-components'

const LoadingStyled = styled.div`
  .loader {
    margin-bottom: 2rem;
    width: 1rem;
    height: 1rem;
    border: 2px solid #fff;
    border-bottom-color: rgb(var(--dark-color));
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default function Loading() {
  return (
    <LoadingStyled>
      <span className="loader" />
    </LoadingStyled>
  )
}
