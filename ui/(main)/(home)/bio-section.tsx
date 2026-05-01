export default function BioSection() {
  return (
    <section className="flex flex-col gap-4 px-4 text-center">
      <h1>
        你好! 我是 <span className="font-bold text-theme-primary">叶鱼 (*´∪`)</span>
      </h1>
      <p>
        一位还在学习 TS 全栈开发的大四学
        <span className="text-pink-500 line-through">生</span>牲 (≖_≖ )
      </p>
      <p>欢迎来到我的主页 Σ( ´･ω･`)</p>
      <p>我把此处当作我的前端试验田，看到有意思的东西都会往里面塞</p>
      <small className="text-xs md:text-sm">
        话说上面的头像可以拖动来着
        <span className="text-theme-indicator"> ⸜( *ˊᵕˋ* )⸝ </span>
      </small>
    </section>
  )
}
