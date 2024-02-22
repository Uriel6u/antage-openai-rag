// pages/api/test.js

export default function handler(req: any, res: any) {
  // Handle different HTTP methods
  if (req.method === "GET") {
    // Return a JSON response
    res.status(200).json({ message: "This is a test endpoint" });
  } else {
    // Return an error for unsupported methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
