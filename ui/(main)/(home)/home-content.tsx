import { Suspense } from 'react'
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
        <Suspense fallback={<div aria-hidden className="mt-4 h-12 w-2/3" />}>
          <EchoCard />
        </Suspense>
      </HomeFadeMotion>

      <HomeFadeMotion>
        <TechStack />
      </HomeFadeMotion>
    </HomeMotionMain>
  )
}
