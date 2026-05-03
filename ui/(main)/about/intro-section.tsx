import { AboutLine, AboutSection } from './about-section'

export function IntroSection() {
  return (
    <AboutSection>
      <AboutLine>
        <p>嗨, 你好呀~👋🏻</p>
      </AboutLine>
      <AboutLine>
        <h2>
          你可以叫我, <span className="font-bold text-theme-indicator">叶鱼</span> (●´ω｀●)ゞ
        </h2>
      </AboutLine>
      <AboutLine>
        <p>一位业余的 TS 全栈开发者 _(:3 ⌒ﾞ)_</p>
      </AboutLine>
      <AboutLine>
        <p>目前人还在上海活着 (¦3[▓▓]</p>
      </AboutLine>
    </AboutSection>
  )
}
