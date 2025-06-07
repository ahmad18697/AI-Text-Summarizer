const isProduction = process.env.NODE_ENV === 'production';

const BACKEND_URL = isProduction
  ? "https://textsummarizer-si3j.onrender.com"
  : "http://localhost:5000";

export default BACKEND_URL;
