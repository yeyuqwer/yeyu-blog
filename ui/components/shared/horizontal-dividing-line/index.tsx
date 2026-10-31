import { FlowerIcon } from './flower-icon'

export default function HorizontalDividingLine() {
  return (
    <div className="relative flex w-full items-center justify-center">
      <hr className="absolute left-0 w-[45%] border-dashed border-black/25 dark:border-white/25" />
      <div className="animate-spin [animation-duration:4s]">
        <FlowerIcon className="text-black dark:text-white" />
      </div>
      <hr className="absolute right-0 w-[45%] border-dashed border-black/25 dark:border-white/25" />
    </div>
  )
}
