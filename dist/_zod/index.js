"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqInput = void 0;
const zod_1 = require("zod");
exports.reqInput = zod_1.z.object({
    source_language: zod_1.z.number(),
    content: zod_1.z.string(),
    target_language: zod_1.z.number(),
});
