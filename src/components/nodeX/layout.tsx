import NodexSidebar from '@/components/navigation/NodexSidebar'

export default function NodexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <NodexSidebar />
      <div className="flex-1 lg:ml-64 w-full">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
