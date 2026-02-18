import BioSection from './bio-section'
import EchoCard from './echo-card'
import HomeContent from './home-content'
import TechStack from './tech-stack'
import YeAvatar from './ye-avatar'

export default function HomePage() {
  return (
    <HomeContent
      avatarSlot={<YeAvatar />}
      bioSlot={<BioSection />}
      echoSlot={<EchoCard />}
      techSlot={<TechStack />}
    />
  )
}
