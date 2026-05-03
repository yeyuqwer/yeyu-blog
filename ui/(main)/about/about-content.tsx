import { DailyLifeSection } from './daily-life-section'
import { FirstHalf2024Section } from './first-half-2024-section'
import { FirstHalf2025Section } from './first-half-2025-section'
import { FirstHalf2026Section } from './first-half-2026-section'
import { Graduation2022Section } from './graduation-2022-section'
import { IntroSection } from './intro-section'
import { SecondHalf2024Section } from './second-half-2024-section'
import { SecondHalf2025Section } from './second-half-2025-section'
import { Summer2022Section } from './summer-2022-section'
import { Year2023Section } from './year-2023-section'

export function AboutContent() {
  return (
    <>
      <IntroSection />
      <DailyLifeSection />
      <Graduation2022Section />
      <Summer2022Section />
      <Year2023Section />
      <FirstHalf2024Section />
      <SecondHalf2024Section />
      <FirstHalf2025Section />
      <SecondHalf2025Section />
      <FirstHalf2026Section />
    </>
  )
}
