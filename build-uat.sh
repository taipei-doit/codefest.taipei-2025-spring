#!/bin/bash

# 🚀 先刪除 public/uat，確保乾淨
rm -rf public/uat

# 執行建置
npm run generate

# ✅ 只在 dist 內有內容時才建立 public/uat
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    mkdir -p public/uat
    cp -r dist/* public/uat/
fi
