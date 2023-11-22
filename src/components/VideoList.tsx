import { styled } from 'styled-components'

const VideoListStyled = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  .video-list {
    display: grid;
    place-items: center;
    gap: 1rem;
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    max-height: calc(100vh + 1rem);
    @media (min-width: 768px) {
      & {
        gap: 2rem;
      }
    }
    & > div:first-child {
      margin-top: 1rem;
    }
    & .video {
      scroll-snap-align: center;
    }
  }
`

export default function VideoList() {
  return (
    <VideoListStyled className="container">
      <div>123</div>
      <div>123</div>
      <div>123</div>
      <div>123</div>
    </VideoListStyled>
  )
}
