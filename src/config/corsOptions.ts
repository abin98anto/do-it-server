export const corsOptions = {
  origin: ["http://localhost:5173","https://do-it-client.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};
