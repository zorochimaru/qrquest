import { Request, Response } from 'express';
import { File } from '../models/file.model';
import { Quest } from '../models/quest.model';
class QuestController {
  createQuest = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const file = req.file;
      if (file) {
        await File.create(file);
      }
      await Quest.create({
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : null,
      });
      res.send({ message: `Quest created` });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  editQuest = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const file = req.file;
      if (file) {
        await File.create(file);
      }
      const findQuest = await Quest.findByPk(id);
      const updatedQuest = await Quest.update({
        ...body,
        imgUrl: file ? `${process.env.API_LINK}/${file?.path}` : findQuest?.imgUrl,
      }, { where: { id } })
      if (updatedQuest) {
        return res.send(updatedQuest);
      }
      throw Error();
    } catch (error) {
      res.status(400).send(error);
    }
  }
  getQuests = async (req: Request, res: Response) => {
    try {
      const params = req.query;
      const offset = (+params.page! - 1) * +params.perPage!;
      const limit = +params.perPage!;
      const questResponce = await Quest.findAndCountAll({
        limit, offset, order: [['createdAt', 'DESC']],
      });
      const totalPages = Math.ceil(questResponce.count / limit);
      const questArray = questResponce.rows;
      res.send({ data: questArray, totalPages, totalItems: questResponce.count });
    } catch (error) {
      res.status(400).send(error);
    }
  }
  getQuest = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const signleQuest = await Quest.findByPk(id);
      if (signleQuest) {
        return res.send(signleQuest);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
  deleteQuest = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Quest.destroy({ where: { id } })
      res.send({ message: `Item deleted` });
    } catch (error) {
      res.status(400).send(error);
    }
  }
 
}

export default new QuestController();