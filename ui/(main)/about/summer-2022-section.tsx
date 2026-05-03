import Link from 'next/link'
import { AboutLine, AboutSection } from './about-section'

export function Summer2022Section() {
  return (
    <AboutSection>
      <AboutLine>
        <h3 className="text-theme-primary">2022年暑假</h3>
      </AboutLine>
      <AboutLine>
        <p>
          看了
          <q>强风吹拂</q>, 为了缓解抑郁，一个暑假, 每天都在跑步
        </p>
      </AboutLine>
      <AboutLine>
        <p>
          再次感谢两个姐姐，给我选了<q>人工智能</q>专业 (^_^)b
        </p>
      </AboutLine>
      <AboutLine>
        <small>虽然后面我自己转专业到了软件工程 (?-ω-)</small>
      </AboutLine>
      <AboutLine>
        <p>也很感谢爸妈，直接给了我 1w 块让我自己买电脑</p>
      </AboutLine>
      <AboutLine>
        <p>最终花了 7499 买了华硕天选 3</p>
      </AboutLine>
      <AboutLine>
        <p>
          第一次接触电脑, 下载
          <q>steam游戏中心</q>🥹
        </p>
      </AboutLine>
      <AboutLine>
        <p>
          第一次尝试编程， <code>print('Hello, World!')</code>
        </p>
      </AboutLine>
      <AboutLine>
        <p>非常感谢那个教会我使用电脑和教我编程的老师了</p>
      </AboutLine>
      <AboutLine>
        <Link href="https://space.bilibili.com/19658621" target="_blank" rel="noreferrer">
          (❀╹◡╹) =&gt;{' '}
          <span className="text-theme-indicator text-xl hover:text-theme-primary">Frank</span>
        </Link>
      </AboutLine>
    </AboutSection>
  )
}
