import { MutterList } from './mutter-list'

export default function MutterPage() {
  return (
    <div>
      <header className="flex">
        <h3 className="mx-auto text-xl">小声嘀咕</h3>
      </header>

      <main>
        <MutterList />
      </main>
    </div>
  )
}
