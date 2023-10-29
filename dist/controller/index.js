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
exports.isAValidLanguageNumber = exports.languages = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main_1 = require("../main");
exports.languages = [
    "bn",
    "ta",
    "te",
    "ml",
    "pa",
    "or",
    "hi",
    "gu",
    "mr",
    "as",
    "kn",
];
const isAValidLanguageNumber = (num) => {
    if (num < 0 || num >= exports.languages.length) {
        return false;
    }
    return true;
};
exports.isAValidLanguageNumber = isAValidLanguageNumber;
function externalApiReq(source_language, content, target_language) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstResponse = yield fetch('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', {
            method: "POST",
            headers: {
                "userID": main_1.config.userID,
                "ulcaApiKey": main_1.config.ulcaApiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "pipelineTasks": [
                    {
                        "taskType": "translation",
                        "config": {
                            "language": {
                                "sourceLanguage": exports.languages[source_language],
                                "targetLanguage": exports.languages[target_language],
                            }
                        }
                    }
                ],
                "pipelineRequestConfig": {
                    "pipelineId": main_1.config.pipelineId,
                }
            })
        });
        const firstData = yield firstResponse.json();
        const callbackUrl = firstData['pipelineInferenceAPIEndPoint']["callbackUrl"];
        const apiKey = firstData['pipelineInferenceAPIEndPoint']["inferenceApiKey"]["value"];
        const serviceId = firstData['pipelineResponseConfig'][0]['config'][0]['serviceId'];
        const secondResponse = yield fetch(callbackUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": apiKey,
            },
            body: JSON.stringify({
                "pipelineTasks": [
                    {
                        "taskType": "translation",
                        "config": {
                            "language": {
                                "sourceLanguage": exports.languages[source_language],
                                "targetLanguage": exports.languages[target_language]
                            },
                            "serviceId": serviceId,
                        }
                    }
                ],
                "inputData": {
                    "input": [
                        {
                            "source": content
                        }
                    ],
                    "audio": [
                        {
                            "audioContent": null
                        }
                    ]
                }
            })
        });
        const secondData = yield secondResponse.json();
        const output = secondData["pipelineResponse"][0]["output"][0]["target"];
        return output;
    });
}
exports.default = externalApiReq;
