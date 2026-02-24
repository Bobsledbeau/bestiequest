#!/bin/bash

cd react_native_space

# Update expo-navigation-bar version
sed -i 's/"expo-navigation-bar": "~3.0.9"/"expo-navigation-bar": "~5.0.10"/' package.json

# Install and update lockfile
corepack enable
yarn set version 4.12.0
yarn install

# Add import and headerBackImage in _layout.tsx
sed -i '/import { COLORS } from /a import { MaterialCommunityIcons } from '@expo/vector-icons';' app/_layout.tsx
sed -i 's/contentStyle: {/headerBackImage: () => (<MaterialCommunityIcons name="arrow-left" size={28} color="#fff" style={{ marginLeft: 8 }} />),\n                headerBackTitleVisible: false,\n                contentStyle: {/g' app/_layout.tsx

# Commit and push
git add package.json yarn.lock app/_layout.tsx
git commit -m "Update expo-navigation-bar version and add vector icon fixes"
git push

echo "Batch fix complete. Trigger Render deploy now."