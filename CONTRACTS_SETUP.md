# Smart Contracts Setup Guide

## Quick Start

If you're seeing TypeScript errors like "Property 'ethers' does not exist on type 'HardhatRuntimeEnvironment'", follow these steps:

### 1. Install Dependencies

```bash
npm install
```

This will install the required Hardhat packages:
- `hardhat`
- `@nomicfoundation/hardhat-toolbox`
- `ethers` v6

### 2. Verify Installation

After installing, the TypeScript errors should disappear. The packages provide type definitions that extend the Hardhat Runtime Environment with `ethers`.

### 3. Common Issues

**Issue: "Module 'hardhat' has no exported member 'ethers'"**

**Solution:** Don't import ethers directly from hardhat. Use:
```typescript
import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

// Then access ethers via hre
const signers = await hre.ethers.getSigners();
```

**Issue: "Property 'ethers' does not exist on type 'HardhatRuntimeEnvironment'"**

**Solution:**
1. Make sure `npm install` has completed
2. Ensure `@nomicfoundation/hardhat-toolbox` is imported in your scripts
3. Check that `hardhat.config.ts` imports `@nomicfoundation/hardhat-toolbox`
4. Verify `tsconfig.json` includes `"scripts/**/*"` and `"hardhat.config.ts"`

## Configuration Files

### hardhat.config.ts
Already configured with:
- ✅ Import `@nomicfoundation/hardhat-toolbox`
- ✅ Solidity 0.8.20 compiler
- ✅ Base Sepolia network
- ✅ BaseScan verification

### tsconfig.json
Already configured with:
- ✅ Includes `scripts/` directory
- ✅ Includes `hardhat.config.ts`
- ✅ Node types

### package.json
Already configured with:
- ✅ `hardhat` dependency
- ✅ `@nomicfoundation/hardhat-toolbox` dependency
- ✅ Deployment scripts

## Usage

Once dependencies are installed, you can use:

```bash
# Compile contracts
npm run compile:contracts

# Deploy to Base Sepolia
npm run deploy:baseSepolia

# Verify on BaseScan
npm run verify:baseSepolia
```

## Why This Works

The `@nomicfoundation/hardhat-toolbox` package is a plugin that:
1. Extends the Hardhat Runtime Environment (hre)
2. Adds the `ethers` property to hre
3. Provides TypeScript type definitions

When you import it:
```typescript
import "@nomicfoundation/hardhat-toolbox";
```

TypeScript learns about the `ethers` property on `hre`, and the errors disappear.

## Need Help?

If you're still seeing errors after running `npm install`:
1. Delete `node_modules/` and `package-lock.json`
2. Run `npm install` again
3. Restart your TypeScript server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")
