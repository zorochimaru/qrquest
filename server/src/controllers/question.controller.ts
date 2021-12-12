import { Request, Response } from 'express';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { File } from '../models/file.model';
import { Quest } from '../models/quest.model';
import UserAnswer from '../models/user_answer.model';
import { Op } from "sequelize";
import { send } from 'process';

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
                text: body.text,
                questId: body.questId,
                order: +body.order,
                imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : null,
                authorId: authorId,
                locationLink: body.locationLink
            });
            if (question) {
                for (const answer of JSON.parse(body.answers)) {
                    await Answer.create({
                        questionId: question.id,
                        value: answer.value,
                        isRight: answer.isRight,
                    });
                }
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
                imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : findQuestion?.imgUrl,
                authorId
            }, { where: { id } })
            if (findQuestion && updatedQuestion) {
                await Answer.destroy({ where: { questionId: id } });
                for (const answer of JSON.parse(body.answers)) {
                    await Answer.upsert({
                        questionId: findQuestion.id,
                        value: answer.value,
                        isRight: answer.isRight,
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

    getQuestionsByQuestId = async (req: Request, res: Response) => {
        try {
            const questId = req.params.questId;
            const questionResponce = await Question.findAndCountAll({
                where: { questId },
                include: [{
                    model: Answer,
                    attributes: ['id', 'value', 'isRight'],
                },
                {
                    model: Quest,
                    attributes: ['name', 'date']
                }
                ],
                order: [['order', 'ASC']],
            });
            res.send(questionResponce.rows);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    getAllQuestions = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const offset = (+params.page! - 1) * +params.perPage!;
            const limit = +params.perPage!;
            const questionResponce = await Question.findAndCountAll({
                include: {
                    model: Answer,
                    attributes: ['id', 'value', 'isRight'],
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
                res.send(signleQuestion);
            } else {
                res.send('no such of question');
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
    answerOnQuestion = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const questId = params.questId?.toString();
            const questionId = params.questionId?.toString();
            const answerId = params.answerId?.toString();
            // const usersAnswer = await Answer.findByPk(answerId);
            const userId = req.session.logedUser?.user.id;
            if (questId && questionId && answerId) {
                // await UserAnswer.create({ userId, answerId, questId, questionId })
                // const quest = await Quest.findByPk(questId);
                // const usersAnswers = await UserAnswer.findAll({ where: { questId } });
                // const test = await Question.findOne({
                //     include: [{
                //         model: UserAnswer,
                //         // where: {
                //             //     userId,
                //             //     questId
                //         // },
                //         attributes: ['questionId']
                //     }],
                //     // where: {
                //     //     questionId: { [Op.not]: `${questionId}` },
                //     // },

                // })
                const a = await Question.findAll({
                    where: {
                        questId,
                    },
                    include: {
                        model: UserAnswer,
                        required: false,
                    },
                });
                // TODO add 'order' column 
                const b = a.filter(q => q.userAnsweredQuestions.length > 0);
                if (b.length) {
                    res.send(b[0].locationLink);
                } else {
                    res.send('FIN');
                }
                // const t = await UserAnswer.findAll();

                // const test = await Question.findAll({
                //     where: {
                //         id: {
                //             [Op.notIn]: [...t.map(t => t.questionId)]
                //         }
                //     }
                // });
                // const userLeftQuestions = quest?.questions.filter(question => usersAnswers.some(x => x.questionId !== question.id));

            }
            res.status(400).send('OOOpse');
        } catch (error) {
            res.status(400).send('error');
        }
    }

    changeOrder = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const fromId = body.fromId;
            const toId = body.toId;
            const toIndex = body.toIndex;
            const fromIndex = body.fromIndex;

            await Question.update({ order: toIndex }, { where: { id: fromId } });
            await Question.update({ order: fromIndex }, { where: { id: toId } });

            res.sendStatus(200);
        } catch (error) {
            res.status(400).send('error');
        }
    }
}

export default new QuestionController();