#!/bin/bash

# Step 1: Enter frontend folder and install Reanimated for animation warnings
cd react_native_space
corepack enable
yarn set version 4.12.0
yarn add react-native-reanimated

# Step 2: Add babel.config.js for Reanimated (correct plugin name)
cat > babel.config.js << EOL
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL

# Step 3: Add metro.config.js for asset bundling (icons, PNGs, fonts)
cat > metro.config.js << EOL
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'ttf', 'otf', 'webp');

module.exports = config;
EOL

# Step 4: Add build:web script to package.json
sed -i 's/"eas-build-pre-install": "corepack enable && yarn set version 4.12.0 && yarn install",/"eas-build-pre-install": "corepack enable && yarn set version 4.12.0 && yarn install",\n    "build:web": "expo export --platform web --output-dir dist",/' package.json

# Step 5: Fix back button in _layout.tsx (use vector icon)
sed -i 's/contentStyle: {/headerBackImage: () => (<MaterialCommunityIcons name="arrow-left" size={28} color="#fff" style={{ marginLeft: 8 }} />),\n                headerBackTitleVisible: false,\n                contentStyle: {/g' app/_layout.tsx

# Step 6: Ensure constants.ts has correct API_BASE_URL for production
sed -i 's/return "http://localhost:3000\/";/return "\/";/g' utils/constants.ts

# Step 7: Fix any .ts to .tsx if JSX is present (e.g., index.ts)
mv index.ts index.tsx

# Step 8: Install and update lockfile if needed
yarn install --mode=update-lockfile

# Step 9: Commit and push all changes
git add .
git commit -m "Batch fix for bundling, icons, back button, animations, PWA, and deployment"
git push

# Step 10: Done – trigger Render deploy
echo "Batch fix complete. Trigger Render deploy now."