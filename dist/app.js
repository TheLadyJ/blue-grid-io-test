"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.transformData = transformData;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
exports.app = app;
// In-memory cache to speed up the fetching of data
const cache = {};
// Endpoint for fetching and transforming data
app.get("/api/files", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if there is stored data in cache
    const cachedData = cache["files"];
    if (cachedData) {
        return res.json(cachedData);
    }
    // Otherwise, fetching data from API
    try {
        const response = yield axios_1.default.get("https://rest-test-eight.vercel.app/api/test");
        const data = response.data.items;
        const transformedData = transformData(data);
        // Caching data
        cache["files"] = transformedData;
        // Exparation time for cache set to one minute
        setTimeout(() => delete cache["files"], 60 * 1000);
        res.json(transformedData);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}));
// Function to transform data into the required nested structure
function transformData(data) {
    const result = {};
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
            }
            else {
                // Any other part is first being searched to see if it already exists in the structure
                let dir = current.find((item) => typeof item === "object" && item[part]);
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
