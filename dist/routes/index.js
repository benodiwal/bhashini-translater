"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const controller_1 = __importStar(require("../controller"));
const _zod_1 = require("../_zod");
const router = express_1.default.Router();
router.post('/scaler/translate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = _zod_1.reqInput.safeParse(req.body);
    if (!parsedInput.success || !(0, controller_1.isAValidLanguageNumber)(parsedInput.data.source_language) || !(0, controller_1.isAValidLanguageNumber)(parsedInput.data.target_language)) {
        return res.status(403).json({
            status_code: 403,
            message: "The req body parameters are invalid"
        });
    }
    const source_language = parsedInput.data.source_language;
    const content = parsedInput.data.content;
    const target_language = parsedInput.data.target_language;
    try {
        const output = yield (0, controller_1.default)(source_language, content, target_language);
        return res.status(200).json({
            "status_code": 200,
            "message": "Translation successfull",
            "translated_content": output,
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "status_code": 500,
            message: "Internal server error",
        });
    }
}));
exports.default = router;
