#!/bin/bash
# Production VPS Setup Script untuk Sidora V3 Upload Fix
# Run: chmod +x setup-production.sh && sudo ./setup-production.sh

set -e

echo "======================================"
echo "Sidora V3 Production Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_USER=${APP_USER:-"www-data"}
APP_GROUP=${APP_GROUP:-"www-data"}
APP_HOME=${APP_HOME:-"/var/www/sidora-v3"}
UPLOADS_BASE="${APP_HOME}/public/uploads"
UPLOAD_DIRS=("berita" "hero")

echo -e "${YELLOW}Step 1: Create Upload Directories${NC}"
for dir in "${UPLOAD_DIRS[@]}"; do
  mkdir -p "${UPLOADS_BASE}/${dir}"
  echo "✓ Created ${UPLOADS_BASE}/${dir}"
done

echo ""
echo -e "${YELLOW}Step 2: Set Directory Permissions${NC}"
for dir in "${UPLOAD_DIRS[@]}"; do
  chown -R ${APP_USER}:${APP_GROUP} "${UPLOADS_BASE}/${dir}"
  chmod -R 755 "${UPLOADS_BASE}/${dir}"
  echo "✓ Set permissions for ${UPLOADS_BASE}/${dir}"
done

echo ""
echo -e "${YELLOW}Step 3: Verify Upload Directories${NC}"
for dir in "${UPLOAD_DIRS[@]}"; do
  if [ -d "${UPLOADS_BASE}/${dir}" ]; then
    echo -e "${GREEN}✓${NC} ${UPLOADS_BASE}/${dir} exists"
    ls -la "${UPLOADS_BASE}/${dir}" | head -5
  else
    echo -e "${RED}✗${NC} ${UPLOADS_BASE}/${dir} NOT FOUND"
    exit 1
  fi
done

echo ""
echo -e "${YELLOW}Step 4: Test Write Permission${NC}"
for dir in "${UPLOAD_DIRS[@]}"; do
  test_file="${UPLOADS_BASE}/${dir}/.write-test"
  if sudo -u ${APP_USER} touch "${test_file}" 2>/dev/null; then
    rm -f "${test_file}"
    echo -e "${GREEN}✓${NC} ${APP_USER} can write to ${UPLOADS_BASE}/${dir}"
  else
    echo -e "${RED}✗${NC} ${APP_USER} CANNOT write to ${UPLOADS_BASE}/${dir}"
    exit 1
  fi
done

echo ""
echo -e "${YELLOW}Step 5: Nginx Configuration${NC}"
echo "Check your Nginx config has these settings in /etc/nginx/sites-available/sidora-v3:"
echo ""
echo -e "  ${GREEN}client_max_body_size 100M;${NC}"
echo -e "  ${GREEN}client_body_timeout 300s;${NC}"
echo -e "  ${GREEN}proxy_read_timeout 300s;${NC}"
echo -e "  ${GREEN}proxy_send_timeout 300s;${NC}"
echo ""
echo "Test Nginx config:"
sudo nginx -t
echo -e "${GREEN}✓${NC} Nginx config is valid"

echo ""
echo -e "${YELLOW}Step 6: Environment Variables Check${NC}"
echo "Make sure these are set in your .env.production or .env file:"
echo ""
echo -e "  ${GREEN}UPLOADS_DIR=${UPLOADS_BASE}/berita${NC}"
echo -e "  ${GREEN}NODE_ENV=production${NC}"
echo -e "  ${GREEN}NEXT_PUBLIC_API_URL=https://sidorav3.cloud${NC}"
echo ""
echo "Set UPLOADS_DIR in .env.production:"
if grep -q "UPLOADS_DIR" "${APP_HOME}/.env.production" 2>/dev/null; then
  echo -e "${GREEN}✓${NC} UPLOADS_DIR already set in .env.production"
else
  echo -e "${YELLOW}!${NC} Add this to .env.production:"
  echo "UPLOADS_DIR=${UPLOADS_BASE}/berita"
fi

echo ""
echo -e "${YELLOW}Step 7: Rebuild Next.js Application${NC}"
echo "Run these commands:"
echo "  cd ${APP_HOME}"
echo "  npm run build"
echo "  pm2 restart sidora-v3"

echo ""
echo -e "${GREEN}======================================"
echo "✓ Production Setup Complete!"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Add UPLOADS_DIR to .env.production if not already set"
echo "2. Run: cd ${APP_HOME} && npm run build"
echo "3. Run: pm2 restart sidora-v3"
echo "4. Test upload: curl -X POST -F 'file=@image.jpg' https://sidorav3.cloud/api/upload"
echo ""
