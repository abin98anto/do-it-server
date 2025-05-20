export const corsOptions = {
  origin: ["https://do-it-client.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};
