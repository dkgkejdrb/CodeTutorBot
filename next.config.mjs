/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      MONGODB_URI: process.env.MONGODB_URI || "",
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_KEY || "",
    },
  };
  
  export default nextConfig;