import { Request, Response } from 'express';
import multer from 'multer';
import News from '../models/news.model';
import File from '../models/file.model';
class NewsController {
    addNews = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const file = req.file;
            const authorId = req.session.logedUser?.user.id;
            await File.create(file);
            const createdNews = await News.create({
                ...body,
                imgUrl: file ? `${process.env.API_LINK}/${file?.destination}/${file?.filename}` : null,
                authorId
            });
            res.send({ message: `${createdNews.title} created` });

        } catch (error) {
            res.status(400).send(error);
        }
    }
    editNews = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const authorId = req.session.logedUser?.user.id;
            const updatedNews = await News.update({ ...body, authorId }, { where: { id } })
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
                limit, offset, order: [['createdAt', 'DESC']],
            });
            const totalPages = Math.ceil(newsResponce.count / limit);

            res.send({ list: newsResponce.rows, totalPages, totalItems: newsResponce.count });
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