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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAValidLanguageNumber = exports.languages = void 0;
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
                "userID": "1e4705f1cb3a4e6eafea35b3f98def60",
                "ulcaApiKey": "073a28eb1e-e4c0-4fb0-8137-58adfeb754cc",
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
                    "pipelineId": "64392f96daac500b55c543cd"
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
