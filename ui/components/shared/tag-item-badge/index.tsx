export default function TagItemBadge({ tag }: { tag: string }) {
  return <span className="border-b-foreground border-b border-dashed">{`#${tag}`}</span>
}
