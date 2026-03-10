'use client'

import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { Children, useEffect } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '@/ui/components/shared/max-width-wrapper'

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0] as number[],
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  const lines = Children.toArray(children).filter(child => {
    if (typeof child === 'string') {
      return child.trim().length > 0
    }
    return true
  })

  return (
    <section className="flex h-[calc(100dvh-100px)] w-full snap-center flex-col items-center justify-center p-4">
      <MaxWidthWrapper>
        <motion.div
          className={cn(
            'flex flex-col items-center justify-center gap-4 text-center md:text-lg',
            className,
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.45, once: true }}
          variants={sectionVariants}
        >
          {lines.map((child, index) => (
            <motion.div key={index} variants={lineVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      </MaxWidthWrapper>
    </section>
  )
}

export default function AboutPage() {
  useEffect(() => {
    document.documentElement.classList.add('snap-y', 'snap-mandatory')
    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory')
    }
  }, [])

  return (
    <div className="w-full">
      <Section>
        <p>嗨, 你好呀~👋🏻</p>
        <h2>
          你可以叫我, <span className="font-bold text-theme-indicator">叶鱼</span> (●´ω｀●)ゞ
        </h2>
        <p>一位业余的前端开发者 _(:3 ⌒ﾞ)_</p>
        <p>目前人还在上海活着 (¦3[▓▓]</p>
      </Section>

      <Section>
        <p>是个死宅 _:(´□`」 ∠):_</p>
        <p>讨厌人多的地方，讨厌吵闹的地方</p>
        <p>平日在家就写写代码，看看书</p>
        <p>天气好的时候可能会出去骑车看看</p>
        <p>不看地图，到处发呆</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2022年高中毕业</h3>
        <p>成绩血崩，算是人生中第二阴暗的时刻了</p>
        <p>
          我有两个姐姐，虽然她们当时没有安慰过我
          <small>（不过其实我也不需要安慰）</small>
        </p>
        <p>但我知道，她们那段时间一直在替我和爸妈沟通</p>
        <p>最后的大学志愿我也没看过</p>
        <p>都是两个姐姐在帮我</p>
        <p>我很感谢她们</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2022年暑假</h3>
        <p>
          看了
          <q>强风吹拂</q>, 为了缓解抑郁，一个暑假, 每天都在跑步
        </p>
        <p>
          再次感谢两个姐姐，给我选了<q>人工智能</q>专业 (^_^)b
        </p>
        <small>虽然后面我自己转专业到了软件工程 (?-ω-)</small>
        <p>也很感谢爸妈，直接给了我 1w 块让我自己买电脑</p>
        <p>最终花了 7499 买了华硕天选 3</p>
        <p>
          第一次接触电脑, 下载
          <q>steam游戏中心</q>🥹
        </p>
        <p>
          第一次尝试编程， <code>print('Hello, World!')</code>
        </p>
        <p>非常感谢那个教会我使用电脑和教我编程的老师了</p>
        <Link href="https://space.bilibili.com/19658621" target="_blank" className="">
          (❀╹◡╹) =&gt;{' '}
          <span className="text-theme-indicator text-xl hover:text-theme-primary">Frank</span>
        </Link>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2023</h3>
        <p>我不知道自己喜欢什么，不知道自己未来要做什么</p>
        <p>
          尝试过剪辑视频，尝试过盯着 k 线炒股，尝试过学习网络安全当<q>黑客</q>...
        </p>
        <p>可能是我那会太浮躁了，也可能只是不喜欢</p>
        <p>最终我都放弃了</p>
        <p>后来为了学习键盘打字，早日实现盲打</p>
        <p>
          每天都在
          <Link
            href="https://dazidazi.com"
            target="_blank"
            className="my-0 text-theme-indicator hover:text-theme-primary"
          >
            这个
          </Link>
          网站上练习打字
        </p>
        <p>然后突然发现，我可能有点适合学习计算机了</p>
        <p>因为我觉得用手敲键盘很有意思</p>
        <p>之后开始学习 Java</p>
        <p>23 年暑假购入了 MacBook air m2</p>
        <p>
          开始学习 <q>前端三剑客</q> <small>感觉这是个很古老的词语了...</small>
        </p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2024 上半</h3>
        <p>
          从 <q>人工智能</q> -&gt; <q>软件工程</q>
        </p>
        <p>因为查了课表，人工智能教的更杂且课程更多</p>
        <p>计算机相关专业中，软件工程是属于课程较少且我已经会的最多的了，遂跑路</p>
        <p>我觉得任何专业都一样，老师们都是傻逼</p>
        <p>而挑一个更课少，课程更简单一点的专业</p>
        <p>可以节省更多的时间去学习我自己喜欢的技术</p>
        <p>继续深入学习前端知识</p>
        <p>
          学习了 vue 框架 <small>现在已经全部还给了尤雨溪(￣▽￣")</small>{' '}
        </p>
        <p>刷算法题</p>
        <p>玩了很多游戏</p>
        <p>去月球，寻找天堂，恋爱绮谭，地平线4</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2024 下半</h3>
        <p>学习 react/next/tailwindcss</p>
        <p>决定走 react 方向，暂时不再看 vue 相关 </p>
        <p>学习区块链相关的知识</p>
        <p>第一次在日记中写到，想进入 Web3</p>
        <p>玩了 summer pockets，一定要去一次圣地巡礼🥹</p>
        <p>重看了一遍「青春猪头少年不会梦到兔女郎学姐」😋</p>
        <p>重看了一遍「玉子市场」😋</p>
        <p>重看了一遍「我是大哥大」😋</p>
        <p>🐀🐀要开始学日语了😡!</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2025 上半</h3>
        <p>逃课</p>
        <p>学习</p>
        <p>搓项目</p>
        <p>看八股文</p>
        <p>刷算法</p>
        <p>投简历</p>
        <p>面试</p>
        <p>离开傻逼学校</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2025 下半</h3>
        <p>上海实习</p>
        <p>上班</p>
        <p>7 月，杭州</p>
        <p>
          认识了很多有意思的人 <small>我是飞舞</small>{' '}
        </p>
        <p>上班</p>
        <p>8 月，深圳</p>
        <p>
          认识了更多有意思的人 <small>我是飞舞</small>{' '}
        </p>
        <p>上班上班上班</p>
        <p>摸鱼摸鱼摸鱼</p>
      </Section>

      <Section>
        <h3 className="text-theme-primary">2026 上半 </h3>
        <p>unknown</p>
      </Section>
    </div>
  )
}
