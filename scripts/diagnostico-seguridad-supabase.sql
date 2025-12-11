-- ================================================================
-- DIAGNÓSTICO DE SEGURIDAD - SUPABASE
-- ================================================================
-- Ejecutar en: Dashboard → SQL Editor → New Query
-- Fecha: 10 Dic 2025
-- Propósito: Identificar los 22 errores del Security Advisor
-- ================================================================

-- ================================================================
-- 1. LISTAR TODAS LAS TABLAS Y SU ESTADO DE RLS
-- ================================================================
SELECT
  '📊 ESTADO RLS POR TABLA' as seccion;

SELECT
  schemaname,
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ RLS Habilitado'
    ELSE '❌ RLS DESHABILITADO - RIESGO'
  END as rls_status,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename;

-- ================================================================
-- 2. TABLAS SIN RLS (CRÍTICO)
-- ================================================================
SELECT
  '🚨 TABLAS SIN RLS (CRÍTICO)' as seccion;

SELECT
  tablename as "Tabla sin protección",
  'ALTER TABLE ' || tablename || ' ENABLE ROW LEVEL SECURITY;' as "SQL para habilitar"
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- ================================================================
-- 3. POLÍTICAS EXISTENTES POR TABLA
-- ================================================================
SELECT
  '🔐 POLÍTICAS RLS EXISTENTES' as seccion;

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================================
-- 4. TABLAS CON RLS PERO SIN POLÍTICAS (BLOQUEA TODO)
-- ================================================================
SELECT
  '⚠️ TABLAS CON RLS PERO SIN POLÍTICAS' as seccion;

SELECT
  t.tablename as "Tabla bloqueada",
  'RLS habilitado pero sin políticas = nadie puede acceder'
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public'
    AND p.tablename = t.tablename
  );

-- ================================================================
-- 5. FUNCIONES CON SECURITY DEFINER (revisar si es intencional)
-- ================================================================
SELECT
  '🔧 FUNCIONES SECURITY DEFINER' as seccion;

SELECT
  routine_name as "Función",
  routine_type,
  security_type,
  CASE
    WHEN security_type = 'DEFINER' THEN '⚠️ Ejecuta con permisos del creador'
    ELSE '✅ Ejecuta con permisos del llamador'
  END as "Nota"
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY security_type DESC, routine_name;

-- ================================================================
-- 6. PERMISOS GRANT EN TABLAS PÚBLICAS
-- ================================================================
SELECT
  '👥 PERMISOS EN TABLAS' as seccion;

SELECT
  grantee,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
ORDER BY table_name, grantee, privilege_type;

-- ================================================================
-- 7. RESUMEN DE PROBLEMAS DETECTADOS
-- ================================================================
SELECT
  '📋 RESUMEN DE PROBLEMAS' as seccion;

SELECT
  'Tablas sin RLS' as problema,
  COUNT(*) as cantidad,
  CASE
    WHEN COUNT(*) > 0 THEN '🚨 CRÍTICO'
    ELSE '✅ OK'
  END as severidad
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false

UNION ALL

SELECT
  'Tablas con RLS sin políticas' as problema,
  COUNT(*) as cantidad,
  CASE
    WHEN COUNT(*) > 0 THEN '⚠️ ALTO'
    ELSE '✅ OK'
  END as severidad
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public' AND p.tablename = t.tablename
  );

-- ================================================================
-- FIN DEL DIAGNÓSTICO
-- ================================================================
SELECT '✅ Diagnóstico completado - Revisa los resultados arriba' as status;
