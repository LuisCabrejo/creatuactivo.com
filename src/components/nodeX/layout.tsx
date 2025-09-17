// ✅ LAYOUT OPCIONAL - Solo para páginas que no incluyan NodeXSidebar directamente
// Como /nodex/page.tsx ya incluye NodeXSidebar, este layout es redundante
// Mantener solo para compatibilidad con otras páginas NodeX si es necesario

import NodeXSidebar from '@/components/NodeXSidebar'

export default function NodeXGroupLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <NodeXSidebar>
      {children}
    </NodeXSidebar>
  )
}
