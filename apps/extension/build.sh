#!/bin/bash
mkdir -p dist/extension
cp manifest.json background.js content.js dist/extension/
cp -r popup icons dist/extension/
cd dist/extension && zip -r ../shieldweb3-extension-v1.0.zip .
echo "Built: dist/shieldweb3-extension-v1.0.zip"
