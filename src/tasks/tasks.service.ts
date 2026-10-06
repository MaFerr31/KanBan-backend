import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    async create (createTaskDto: CreateTaskDto, userId: string){
      return this.prisma.task.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });
    }

    async findAllTasks(userId: string){
      return this.prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    async findOneTaskById(id: string, userId: string) {
      const task = await this.prisma.task.findFirst({
        where: { id, userId },
      });

      if (!task){
        throw new NotFoundException('Tarefa não encontrada.');
      }

      return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string){
      await this.findOneTaskById(id, userId);

      return this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    }

    async removeTask(id: string, userId: string) {
      await this.findOneTaskById(id, userId);

      return this.prisma.task.delete({
        where: { id },
      });
    }
}
