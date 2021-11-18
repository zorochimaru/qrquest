import { Request, Response } from 'express';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { File } from '../models/file.model';
import sequelize from '../util/database';
import { Sequelize } from 'sequelize-typescript';
class QuestionController {
    addQuestion = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            if (file) {
                await File.create(file);
            }
            const question = await Question.create({
                question: body.question,
                imgUrl: file ? `${process.env.API_LINK}/${file?.destination}/${file?.filename}` : null,
                authorId
            });
            for (const answer of JSON.parse(body.answers)) {
                await Answer.create({
                    questionId: question.id,
                    value: answer.value
                });
            }
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
            if (findQuestion && updatedQuestion) {
                await Answer.destroy({ where: { questionId: id } });
                for (const answer of JSON.parse(body.answers)) {
                    await Answer.upsert({
                        questionId: findQuestion.id,
                        value: answer.value
                    })
                }
            }
            if (updatedQuestion) {
                return res.send(updatedQuestion);
            }
            throw Error();
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getQuestions = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const offset = (+params.page! - 1) * +params.perPage!;
            const limit = +params.perPage!;
            const questionResponce = await Question.findAndCountAll({
                include: {
                    model: Answer,
                    attributes: ['id', 'value'],
                },
                limit, offset, order: [['createdAt', 'DESC']],
            });
            const totalPages = Math.ceil(questionResponce.count / limit);
            const questionArray = questionResponce.rows;
            res.send({ list: questionArray, totalPages, totalItems: questionResponce.count });
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getQuestion = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const signleQuestion = await Question.findByPk(id, {
                include: {
                    model: Answer,
                    attributes: ['id', 'value'],
                },
            });
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