import BioSection from './bio-section'
import EchoCard from './echo-card'
import {
  HomeAvatarMotion,
  HomeBioMotion,
  HomeFadeMotion,
  HomeMotionMain,
} from './home-content-motion'
import TechStack from './tech-stack'
import YeAvatar from './ye-avatar'

export default function HomeContent() {
  return (
    <HomeMotionMain>
      <HomeAvatarMotion>
        <YeAvatar />
      </HomeAvatarMotion>

      <HomeBioMotion>
        <BioSection />
      </HomeBioMotion>

      <HomeFadeMotion>
        <EchoCard />
      </HomeFadeMotion>

      <HomeFadeMotion>
        <TechStack />
      </HomeFadeMotion>
    </HomeMotionMain>
  )
}
