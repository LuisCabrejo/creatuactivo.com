#!/bin/bash
# ========================================
# FASE 1 - Script de Testing del Producer
# ========================================

BASE_URL="${1:-http://localhost:3000}"
PRODUCER_URL="$BASE_URL/api/nexus/producer"

echo "=========================================="
echo "FASE 1 - Testing Producer Endpoint"
echo "URL: $PRODUCER_URL"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET $PRODUCER_URL"
echo ""

response=$(curl -s -w "\n%{http_code}" "$PRODUCER_URL")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ Health check failed (HTTP $http_code)${NC}"
    echo "$body"
fi

echo ""
echo "=========================================="
echo ""

# Test 2: Enviar mensaje simple
echo -e "${YELLOW}Test 2: Enviar mensaje simple${NC}"
echo "POST $PRODUCER_URL"
echo ""

payload='{
  "messages": [
    {"role": "user", "content": "Hola"}
  ],
  "sessionId": "test-session-'$(date +%s)'",
  "fingerprint": "test-fp-'$(date +%s)'"
}'

echo "Payload:"
echo "$payload" | jq '.'
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$PRODUCER_URL" \
  -H "Content-Type: application/json" \
  -d "$payload")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 202 ]; then
    echo -e "${GREEN}✓ Message queued successfully (HTTP 202)${NC}"
    echo "$body" | jq '.'
    message_id=$(echo "$body" | jq -r '.messageId')
    echo ""
    echo -e "${GREEN}Message ID: $message_id${NC}"
else
    echo -e "${RED}✗ Failed to queue message (HTTP $http_code)${NC}"
    echo "$body"
fi

echo ""
echo "=========================================="
echo ""

# Test 3: Conversación completa con datos reales
echo -e "${YELLOW}Test 3: Conversación completa con extracción de datos${NC}"
echo "POST $PRODUCER_URL"
echo ""

payload='{
  "messages": [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "¡Hola! Bienvenido a CreaTuActivo.com. Soy NEXUS. ¿En qué puedo ayudarte hoy?"},
    {"role": "user", "content": "Me llamo Carlos Rodriguez y trabajo en una empresa de software"},
    {"role": "assistant", "content": "Mucho gusto Carlos. ¿Qué te trae por aquí?"},
    {"role": "user", "content": "Quiero información sobre los paquetes de inversión"}
  ],
  "sessionId": "test-full-conversation-'$(date +%s)'",
  "fingerprint": "test-fp-carlos-'$(date +%s)'",
  "metadata": {
    "url": "https://creatuactivo.com/test",
    "userAgent": "Mozilla/5.0 Test Script"
  }
}'

echo "Payload:"
echo "$payload" | jq '.'
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$PRODUCER_URL" \
  -H "Content-Type: application/json" \
  -d "$payload")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 202 ]; then
    echo -e "${GREEN}✓ Conversation queued successfully (HTTP 202)${NC}"
    echo "$body" | jq '.'
    message_id=$(echo "$body" | jq -r '.messageId')
    echo ""
    echo -e "${GREEN}Message ID: $message_id${NC}"
    echo ""
    echo -e "${YELLOW}Datos esperados a extraer:${NC}"
    echo "  - Nombre: Carlos Rodriguez"
    echo "  - Ocupación: empresa de software"
    echo "  - Nivel interés: ~7 (nombre + interés en paquetes)"
    echo "  - Arquetipo: profesional_vision"
    echo "  - Momento: caliente"
else
    echo -e "${RED}✗ Failed to queue conversation (HTTP $http_code)${NC}"
    echo "$body"
fi

echo ""
echo "=========================================="
echo ""

# Test 4: Validación - Sin sessionId
echo -e "${YELLOW}Test 4: Validación - Request sin sessionId (debe fallar)${NC}"
echo ""

payload='{
  "messages": [{"role": "user", "content": "Test"}]
}'

response=$(curl -s -w "\n%{http_code}" -X POST "$PRODUCER_URL" \
  -H "Content-Type: application/json" \
  -d "$payload")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 400 ]; then
    echo -e "${GREEN}✓ Validation working correctly (HTTP 400)${NC}"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ Validation failed - expected HTTP 400, got $http_code${NC}"
    echo "$body"
fi

echo ""
echo "=========================================="
echo ""

# Test 5: Advertencia - Sin fingerprint
echo -e "${YELLOW}Test 5: Request sin fingerprint (debe aceptar con advertencia)${NC}"
echo ""

payload='{
  "messages": [{"role": "user", "content": "Test sin fingerprint"}],
  "sessionId": "test-no-fingerprint-'$(date +%s)'"
}'

response=$(curl -s -w "\n%{http_code}" -X POST "$PRODUCER_URL" \
  -H "Content-Type: application/json" \
  -d "$payload")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 202 ]; then
    echo -e "${GREEN}✓ Message queued without fingerprint (HTTP 202)${NC}"
    echo "$body" | jq '.'
    echo ""
    echo -e "${YELLOW}⚠️  Check server logs for fingerprint warning${NC}"
else
    echo -e "${RED}✗ Unexpected response (HTTP $http_code)${NC}"
    echo "$body"
fi

echo ""
echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check Supabase SQL Editor:"
echo "   SELECT * FROM pgmq_metrics('nexus-prospect-ingestion');"
echo ""
echo "2. View queued messages:"
echo "   SELECT * FROM pgmq.q_nexus_prospect_ingestion LIMIT 10;"
echo ""
echo "3. Invoke consumer manually or wait for Cron:"
echo "   curl -X POST <EDGE_FUNCTION_URL> -H 'Authorization: Bearer <KEY>'"
echo ""
echo "4. Verify data was saved:"
echo "   SELECT * FROM prospect_data ORDER BY created_at DESC LIMIT 10;"
echo ""
