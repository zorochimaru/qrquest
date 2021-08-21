import { Request, Response } from 'express';
import News from '../models/news.model';
class NewsController {
    addNews = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const authorId = req.session.logedUser?.user.id;

            const createdNews = await News.create({ ...body, authorId });
            res.send({ message: `${createdNews.title} created` });
       
        } catch (error) {
            res.status(400).send(error);
        }
    }
    getNews = async (req: Request, res: Response) => {
        try {
            const params = req.query;
            const offset = (+params.page! - 1) * +params.perPage!;
            const limit = +params.perPage!;
            const newsResponce = await News.findAndCountAll({ limit, offset });
            const totalPages = Math.ceil(newsResponce.count / limit);
            
            res.send({ list: newsResponce.rows, totalPages, totalItems: newsResponce.count });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new NewsController();