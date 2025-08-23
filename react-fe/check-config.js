#!/usr/bin/env node

/**
 * Configuration Validator for React Frontend
 * Checks if all required environment variables are set
 */

const requiredVars = {
  VITE_API_URL: 'Backend API URL (EC2 instance)',
  VITE_ADMIN_TOKEN: 'Admin authentication token'
};

const optionalVars = {
  VITE_CONTACT_LAMBDA_URL: 'Contact form Lambda function URL',
  VITE_FRONTEND_URL: 'Frontend URL (for reference)'
};

console.log('🔍 Checking React Frontend Configuration...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: Not set (${description})`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:');
Object.entries(optionalVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚪ ${varName}: Not set (${description})`);
  }
});

console.log('\n🔧 Configuration Status:');
if (hasErrors) {
  console.log('❌ Configuration has errors! Please set the missing required variables.');
  console.log('\n📝 To fix:');
  console.log('1. Copy .env.example to .env: cp .env.example .env');
  console.log('2. Edit .env file with your values: nano .env');
  console.log('3. For Amplify: Set environment variables in Amplify Console');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  
  // Test API connection if possible
  if (process.env.VITE_API_URL) {
    console.log('\n🌐 Testing API connection...');
    const apiUrl = process.env.VITE_API_URL;
    
    // Simple check if URL looks valid
    try {
      const url = new URL(`${apiUrl}/api/health`);
      console.log(`🔗 API Health Check URL: ${url.toString()}`);
      console.log('💡 Test manually with: curl ' + url.toString());
    } catch (error) {
      console.log(`⚠️  API URL format might be invalid: ${apiUrl}`);
    }
  }
}

console.log('\n✨ Configuration check complete!');
