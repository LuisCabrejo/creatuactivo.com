import NodeXSidebar from '@/components/NodeXSidebar'

export default function NodeXLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <NodeXSidebar>{children}</NodeXSidebar>
    </div>
  )
}
