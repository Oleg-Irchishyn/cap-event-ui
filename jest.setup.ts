// Set timezone to UTC for consistent test results across environments
// This ensures date parsing and formatting behave the same locally and in CI
process.env.TZ = 'UTC';
