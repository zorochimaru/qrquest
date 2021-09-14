import { Request, Response } from 'express';
import { Question } from '../models/question.model';
import { File } from '../models/file.model';
// import NewsTags from '../models/news_tags.model';
class QuestionController {
    addQuestion = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            if (file) {
                await File.create(file);
            }
            // NewsTags.create();

            await Question.create({
                ...body,
                imgUrl: file ? `${process.env.API_LINK}/${file?.destination}/${file?.filename}` : null,
                authorId
            });
            res.send({ message: `Question created` });

        } catch (error) {
            res.status(400).send(error);
        }
    }
    editQuestion = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            if (file) {
                await File.create(file);
            }
            const findQuestion = await Question.findByPk(id);
            const updatedQuestion = await Question.update({
                ...body,
                imgUrl: file ? `${process.env.API_LINK}/${file?.destination}/${file?.filename}` : findQuestion?.imgUrl,
                authorId
            }, { where: { id } })
            if (updatedQuestion) {
                return res.sendStatus(200);
            }
            throw Error();
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getQuestion = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const offset = (+params.page! - 1) * +params.perPage!;
            const limit = +params.perPage!;
            const questionResponce = await Question.findAndCountAll({
                limit, offset, order: [['createdAt', 'DESC']],
            });
            const totalPages = Math.ceil(questionResponce.count / limit);
            const questionArray = questionResponce.rows;
            res.send({ list: questionArray, totalPages, totalItems: questionResponce.count });
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getSingleQuestion = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const signleQuestion = await Question.findByPk(id);
            if (signleQuestion) {
                return res.send(signleQuestion);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
    deleteQuestion = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await Question.destroy({ where: { id } })
            res.send({ message: `Item deleted` });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new QuestionController();