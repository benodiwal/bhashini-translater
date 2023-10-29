import dotenv from "dotenv";
dotenv.config();

import { config } from "../main";

export const languages: string[] = [
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

export const isAValidLanguageNumber = (num: number): boolean => {
  if (num < 0 || num >= languages.length) {
    return false;
  }
  return true;
};

export default async function externalApiReq(source_language: number, content: string, target_language: number): Promise<string> {

    const firstResponse = await fetch('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', {
        method: "POST",
        headers: {
            "userID": config.userID,
            "ulcaApiKey": config.ulcaApiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": languages[source_language],
                            "targetLanguage": languages[target_language],
                        }
                    }
                }
            ],
            "pipelineRequestConfig": {
                "pipelineId": config.pipelineId,
            }
        }) 
    });

    const firstData = await firstResponse.json();
    const callbackUrl = firstData['pipelineInferenceAPIEndPoint']["callbackUrl"];
	const apiKey = firstData['pipelineInferenceAPIEndPoint']["inferenceApiKey"]["value"];
	const serviceId = firstData['pipelineResponseConfig'][0]['config'][0]['serviceId'];

	const secondResponse = await fetch(callbackUrl, {
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
                    "sourceLanguage": languages[source_language],
                    "targetLanguage": languages[target_language]
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

	const secondData = await secondResponse.json();
	const output = secondData["pipelineResponse"][0]["output"][0]["target"];

    return output;
}