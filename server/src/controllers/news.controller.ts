import { Request, Response } from 'express';
import { News } from '../models/news.model';
import { File } from '../models/file.model';
import { Tag } from '../models/tag.model';
class NewsController {
    addNews = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const title = body.title;
            const text = body.text;
            const tagIds = JSON.parse(body.tagIds);
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            if (file) {
                await File.create(file);
            }
            const createdNews = await News.create({
                title,
                text,
                imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : null,
                authorId
            });
            await createdNews.$set('tags', tagIds);
            res.send({ message: `${createdNews.title} created` });

        } catch (error) {
            res.status(400).send(error);
        }
    }
    editNews = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            if (file) {
                await File.create(file);
            }
            const findNews = await News.findByPk(id);
            const updatedNews = await News.update({
                ...body,
                imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : findNews?.imgUrl,
                authorId
            }, { where: { id } })
            if (updatedNews) {
                return res.sendStatus(200);
            }
            throw Error();
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getNews = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const offset = (+params.page! - 1) * +params.perPage!;
            const limit = +params.perPage!;
            const newsResponce = await News.findAndCountAll({
                include: [{
                    model: Tag,
                    through: {
                        attributes: []
                    },
                    isAliased: true,
                    attributes: ['id','value'],
                }],
                limit, offset, order: [['createdAt', 'DESC']],
            });
            const totalPages = Math.ceil(newsResponce.count / limit);
            const newsArray = newsResponce.rows;
            res.send({ list: newsArray, totalPages, totalItems: newsResponce.count });
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getSingleNews = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const signleNews = await News.findByPk(id, {
                include: [{
                    model: Tag,
                    through: {
                        attributes: []
                    },
                    isAliased: true,
                    attributes: ['id','value'],
                }],
            });
            if (signleNews) {
                return res.send(signleNews);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
    deleteNews = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await News.destroy({ where: { id } })
            res.send({ message: `Item deleted` });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new NewsController();