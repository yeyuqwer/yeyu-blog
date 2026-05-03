import Link from 'next/link'
import { AboutLine, AboutSection } from './about-section'

export function Year2023Section() {
  return (
    <AboutSection>
      <AboutLine>
        <h3 className="text-theme-primary">2023</h3>
      </AboutLine>
      <AboutLine>
        <p>我不知道自己喜欢什么，不知道自己未来要做什么</p>
      </AboutLine>
      <AboutLine>
        <p>
          尝试过剪辑视频，尝试过盯着 k 线炒股，尝试过学习网络安全当<q>黑客</q>...
        </p>
      </AboutLine>
      <AboutLine>
        <p>可能是我那会太浮躁了，也可能只是不喜欢</p>
      </AboutLine>
      <AboutLine>
        <p>最终我都放弃了</p>
      </AboutLine>
      <AboutLine>
        <p>后来为了学习键盘打字，早日实现盲打</p>
      </AboutLine>
      <AboutLine>
        <p>
          每天都在
          <Link
            href="https://dazidazi.com"
            target="_blank"
            rel="noreferrer"
            className="my-0 text-theme-indicator hover:text-theme-primary"
          >
            这个
          </Link>
          网站上练习打字
        </p>
      </AboutLine>
      <AboutLine>
        <p>然后突然发现，我可能有点适合学习计算机了</p>
      </AboutLine>
      <AboutLine>
        <p>因为我觉得用手敲键盘很有意思</p>
      </AboutLine>
      <AboutLine>
        <p>之后开始学习 Java</p>
      </AboutLine>
      <AboutLine>
        <p>23 年暑假购入了 MacBook air m2</p>
      </AboutLine>
      <AboutLine>
        <p>
          开始学习 <q>前端三剑客</q> <small>感觉这是个很古老的词语了...</small>
        </p>
      </AboutLine>
    </AboutSection>
  )
}
