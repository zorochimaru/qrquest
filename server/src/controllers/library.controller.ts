import { Tag } from "../models/tag.model";
import { Request, Response } from 'express';

class LibraryController {
    getTags = async (req: Request, res: Response) => {
        try {
            const tags = await Tag.findAll();
            res.send(tags);
        } catch (error) {
            res.sendStatus(400).send(error);
        }
    }
}
export default new LibraryController();