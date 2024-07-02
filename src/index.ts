import express from "express";
import axios from "axios";
import { ApiResponse, FileItem } from "./interfaces";

const app = express();
const port = 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// In-memory cache to speed up the fetching of data
const cache: { [key: string]: any } = {};

// Endpoint for fetching and transforming data
app.get("/api/files", async (req, res) => {
  // Checking if there is stored data in cache
  const cachedData = cache["files"];
  if (cachedData) {
    return res.json(cachedData);
  }

  // Otherwise, fetching data from API
  try {
    const response = await axios.get<ApiResponse>(
      "https://rest-test-eight.vercel.app/api/test"
    );
    const data = response.data.items;

    const transformedData = transformData(data);

    // Caching data
    cache["files"] = transformedData;
    // Exparation time for cache set to one minute
    setTimeout(() => delete cache["files"], 60 * 1000);

    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Function to transform data into the required nested structure
export function transformData(data: FileItem[]): any {
  const result: { [key: string]: any } = {};

  data.forEach((item) => {
    const url = new URL(item.fileUrl);
    const ip = url.hostname;
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (!result[ip]) {
      result[ip] = [];
    }

    let current = result[ip];

    pathParts.forEach((part, index) => {
      // Last part in the URL path is beeing added as a file
      if (index === pathParts.length - 1) {
        current.push(part);
      } else {
        // Any other part is first being searched to see if it already exists in the structure
        let dir = current.find(
          (item: any) => typeof item === "object" && item[part]
        );

        //If not, it is being added
        if (!dir) {
          dir = { [part]: [] };
          current.push(dir);
        }

        current = dir[part];
      }
    });
  });

  return result;
}
