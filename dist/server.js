"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 3000;
if (require.main === module) {
    app_1.app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
