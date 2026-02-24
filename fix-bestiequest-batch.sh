#!/bin/bash

# Frontend fixes
cd react_native_space
corepack enable
yarn set version 4.12.0
yarn add react-native-reanimated
yarn install --immutable

# Add babel.config.js (correct plugin)
cat > babel.config.js << EOL
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL

# Add metro.config.js
cat > metro.config.js << EOL
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'ttf', 'otf', 'webp');

module.exports = config;
EOL

# Add build:web to package.json
sed -i 's/"eas-build-pre-install": "corepack enable && yarn set version 4.12.0 && yarn install",/"eas-build-pre-install": "corepack enable && yarn set version 4.12.0 && yarn install",\n    "build:web": "expo export --platform web --output-dir dist",/' package.json

# Fix back button in _layout.tsx
sed -i '/import { COLORS } from /a import { MaterialCommunityIcons } from \'@expo/vector-icons\';' app/_layout.tsx
sed -i 's/contentStyle: {/headerBackImage: () => (<MaterialCommunityIcons name="arrow-left" size={28} color="#fff" style={{ marginLeft: 8 }} />),\n                headerBackTitleVisible: false,\n                contentStyle: {/g' app/_layout.tsx

# Fix API_BASE_URL in constants.ts
sed -i 's/return "http://localhost:3000\/";/return "\/";/g' utils/constants.ts

# Rename index.ts to index.tsx
mv index.ts index.tsx

# Backend fixes (if needed – add Prisma migration, CORS)
cd ../node_js_space
yarn install --immutable
npx prisma migrate deploy  # Run migrations if Prisma is set
sed -i '/@nestjs/core/a @nestjs/cors' package.json  # Add CORS if not there
yarn install --mode=update-lockfile

# Commit and push all
cd ..
git add .
git commit -m "Batch fix for all obstacles: bundling, icons, back button, animations, PWA, backend"
git push

echo "Batch fix complete. Trigger Render deploy for frontend and backend if separate."