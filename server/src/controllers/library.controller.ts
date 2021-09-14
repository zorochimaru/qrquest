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
    newTag = async (req: Request, res: Response) => {
        try {
            const tagName = req.body?.text;
            const newTag = await Tag.create({ value: tagName });
            res.send({ message: `${newTag.value} created` });
        } catch (error) {
            res.sendStatus(400).send(error);
        }
    }
    editTag = async (req: Request, res: Response) => {
        try {
            const id = req.body?.id;
            const newValue = req.body?.value;
            const tags = await Tag.update({ value: newValue }, { where: { id } });
            res.send({ message: `Tag updated` });
        } catch (error) {
            res.sendStatus(400).send(error);
        }
    }
    deleteTag = async (req: Request, res: Response) => {
        try {
            const id = req.params?.id;
            await Tag.destroy({ where: { id } });
            res.send({ message: `Tag deleted` });
        } catch (error) {
            res.sendStatus(400).send(error);
        }
    }
}
export default new LibraryController();