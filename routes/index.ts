import express, { Request, Response} from "express";
import externalApiReq, { isAValidLanguageNumber } from "../controller";
import { reqInput } from "../_zod";

const router = express.Router();

router.post('/scaler/translate', async (req: Request, res: Response) => {
    const parsedInput = reqInput.safeParse(req.body);

    if (!parsedInput.success) {
        return res.status(403).json({
            status_code: 403,
            message: "The req body parameters are invalid"
        });
    }

    const source_language = parsedInput.data.source_language;
    const content = parsedInput.data.content;
    const target_language = parsedInput.data.target_language;

    try {
    const output = await externalApiReq(source_language, content, target_language);
    
    return res.status(200).json({
        "status_code": 200,
        "message": "Translation successfull",
        "translated_content": output,
    });
    
    } catch (e) {
        return res.status(500).json({
            "status_code": 500,
            message: "Internal server error",
        });
    }

});

export default router;