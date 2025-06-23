# Gelato Smart Wallet + Privy Integration Setup Guide

## Overview

This guide will help you set up the Gelato Smart Wallet with Privy authentication for seamless Web2-style onboarding in your finance advice app.

## What You're Building

- **Smart Wallets**: Users get ERC-4337 compatible smart contract wallets with advanced features
- **Web2 Onboarding**: Users can create wallets using email, phone, or social logins (no seed phrases!)
- **Gasless Transactions**: Optional gas sponsorship for smooth UX
- **Flow EVM Integration**: Full compatibility with Flow blockchain's EVM side

## Step 1: Privy Dashboard Setup

### 1.1 Create Your Privy Account

1. Go to [dashboard.privy.io](https://dashboard.privy.io)
2. Sign up for a new account or log in
3. Create a new app for your project

### 1.2 Configure Your App Settings

1. **App Name**: Set to "Finance Advice App" (or your preferred name)
2. **App URL**:
   - Development: `http://localhost:3000`
   - Production: Your deployed URL
3. **Logo**: Upload your app logo (optional)

### 1.3 Configure Login Methods

Navigate to the "Login methods" section and enable:

- ✅ **Email** (primary method)
- ✅ **Google** (social login)
- ✅ **Apple** (social login)
- ✅ **Twitter/X** (social login)
- ✅ **Discord** (social login)
- ✅ **Wallet Connect** (for existing wallet users)
- ✅ **MetaMask** (for existing wallet users)

### 1.4 Configure Embedded Wallets

1. Go to "Embedded wallets" section
2. **Enable embedded wallets**: ✅ Yes
3. **Wallet creation**: Automatic on login
4. **Recovery method**: Email-based recovery

### 1.5 Network Configuration

1. Navigate to "Networks" section
2. Add Flow EVM Testnet:
   - **Network Name**: Flow EVM Testnet
   - **Chain ID**: 545
   - **RPC URL**: `https://testnet.evm.nodes.onflow.org`
   - **Currency Symbol**: FLOW
   - **Block Explorer**: `https://evm-testnet.flowscan.io`

### 1.6 Get Your App ID

1. Go to "Settings" → "Basics"
2. Copy your **App ID** (starts with `clp...`)
3. Add to your `.env.local`:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
```

## Step 2: Optional Gelato Sponsor API Key (for Gasless Transactions)

### 2.1 Create Gelato Account

1. Go to [app.gelato.network](https://app.gelato.network)
2. Sign up and connect your wallet
3. Navigate to "Relay" section

### 2.2 Create Sponsor API Key

1. Click "Create new app"
2. **App Name**: Finance Advice App
3. **Networks**: Select Flow EVM Testnet (Chain ID: 545)
4. Copy your **Sponsor API Key**
5. Add to your `.env.local`:

```bash
NEXT_PUBLIC_GELATO_SPONSOR_API_KEY=your_sponsor_key_here
```

## Step 3: Environment Variables

Create or update your `.env.local` file:

```bash
# Required for Privy authentication
NEXT_PUBLIC_PRIVY_APP_ID=clp_your_app_id_here

# Optional for gasless transactions
NEXT_PUBLIC_GELATO_SPONSOR_API_KEY=your_sponsor_key_here
```

## Expected User Experience Flow

### 1. Landing Page → Wallet Connection

- User sees your finance advice landing page
- Clicks "Launch App" → redirected to wallet connection page

### 2. Wallet Connection Options

- **Primary**: "Start with Email or Social" (Privy-powered)
- **Secondary**: "Connect Existing Wallet" (for crypto users)

### 3. Email/Social Flow (Most Users)

```
User clicks "Start with Email"
→ Privy modal opens
→ User enters email
→ Email verification (OTP sent)
→ User verifies OTP
→ Smart wallet automatically created
→ User redirected to portfolio page
```

### 4. Existing Wallet Flow (Crypto Users)

```
User clicks "Connect Wallet"
→ Wallet selection modal (MetaMask, WalletConnect, etc.)
→ User connects existing wallet
→ Wallet upgraded to smart account (EIP-7702)
→ User redirected to portfolio page
```

### 5. Portfolio Page Experience

- User sees their smart wallet address
- Connection status indicator (✅ Wallet Connected)
- Portfolio visualization and advisor selection
- All interactions can be gasless (if Sponsor API key configured)

## Technical Architecture

### Smart Wallet Features

- **ERC-4337 Compatible**: Full Account Abstraction support
- **Social Recovery**: Users can recover via email/social
- **Batch Transactions**: Multiple operations in one transaction
- **Gasless Transactions**: Optional gas sponsorship
- **Multi-chain**: Ready for Flow mainnet and other EVM chains

### Authentication Flow

1. **Privy** handles authentication (email/social/existing wallets)
2. **Gelato** creates and manages smart contract wallets
3. **Your app** stores user preferences and portfolio data locally
4. **Flow EVM** provides the blockchain infrastructure

## Troubleshooting

### Common Issues

1. **"Property 'type' is missing" error**

   - Ensure you're using `privy()` function, not object
   - Check imports are from `@gelatonetwork/smartwallet-react-sdk`

2. **Privy modal not appearing**

   - Verify your App ID is correct
   - Check network configuration in Privy dashboard
   - Ensure localhost:3000 is in allowed origins

3. **Wallet not connecting**

   - Verify Flow EVM testnet is configured in Privy
   - Check browser console for errors
   - Ensure environment variables are loaded

4. **Gasless transactions not working**
   - Verify Sponsor API key is correct
   - Check you have sufficient Gelato credits
   - Ensure Flow EVM is enabled in Gelato dashboard

### Development Tips

1. **Test with multiple auth methods**: Try email, Google, and existing wallet connections
2. **Monitor wallet creation**: Check browser dev tools for wallet addresses
3. **Test transaction flows**: Use Gelato's test methods for transaction simulation
4. **Local storage**: User data persists across browser sessions

## Production Checklist

Before deploying:

- [ ] Update Privy app URL to production domain
- [ ] Configure production Gelato Sponsor API key
- [ ] Switch to Flow EVM mainnet (Chain ID: 747)
- [ ] Test all authentication flows
- [ ] Verify gasless transactions work
- [ ] Monitor wallet creation and user flows

## Expected Benefits

### For Non-Crypto Users

- No seed phrases or complex wallet setup
- Familiar email/social login experience
- Automatic wallet creation and management
- Gasless transactions (no gas fee confusion)

### For Existing Crypto Users

- Keep using preferred wallets
- Automatic smart account upgrade
- Enhanced security and recovery options
- Batch transactions and advanced features

### For Your Business

- Higher conversion rates (Web2-style onboarding)
- Lower support burden (no seed phrase issues)
- Better user retention
- Advanced wallet analytics and insights

## Next Steps

After setup is complete:

1. Test the full user flow from landing to portfolio
2. Customize the UI to match your brand
3. Implement portfolio management features
4. Add advisor AI integration
5. Deploy to production with mainnet configuration
