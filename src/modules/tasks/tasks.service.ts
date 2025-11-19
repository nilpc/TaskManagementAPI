import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskShare } from './entities/task-share.entity';
import { CreateTaskDto, UpdateTaskDto, ShareTaskDto } from './dto/task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskShare)
    private taskShareRepository: Repository<TaskShare>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      ownerId: userId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: [
        { ownerId: userId },
        { shares: { sharedWithId: userId } },
      ],
      relations: ['owner', 'shares', 'shares.sharedWith'],
    });
  }

  async findById(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['owner', 'shares', 'shares.sharedWith'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user owns the task or has access through sharing
    const hasAccess =
      task.ownerId === userId ||
      task.shares.some((share) => share.sharedWithId === userId);

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findById(id, userId);

    // Check if user owns the task or has edit permission
    const share = task.shares.find((s) => s.sharedWithId === userId);
    if (task.ownerId !== userId && (!share || share.permission !== 'edit')) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    // Optimistic locking: check if version matches
    if (updateTaskDto.version !== undefined && updateTaskDto.version !== task.version) {
      throw new ConflictException(
        'Task has been modified by another user. Please refresh and try again.',
      );
    }

    const { version, ...updateData } = updateTaskDto;
    Object.assign(task, updateData);

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findById(id, userId);

    if (task.ownerId !== userId) {
      throw new ForbiddenException('Only owner can delete this task');
    }

    await this.tasksRepository.remove(task);
  }

  async shareTask(id: string, shareDto: ShareTaskDto, userId: string): Promise<TaskShare> {
    const task = await this.findById(id, userId);

    if (task.ownerId !== userId) {
      throw new ForbiddenException('Only owner can share this task');
    }

    // Verify the user exists
    const userExists = await this.usersRepository.findOne({
      where: { id: shareDto.sharedWithId },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    if (shareDto.sharedWithId === userId) {
      throw new ConflictException('Cannot share task with yourself');
    }

    // Check if already shared
    const existingShare = await this.taskShareRepository.findOne({
      where: {
        taskId: id,
        sharedWithId: shareDto.sharedWithId,
      },
    });

    if (existingShare) {
      // Update permission
      existingShare.permission = shareDto.permission;
      return this.taskShareRepository.save(existingShare);
    }

    const share = this.taskShareRepository.create({
      taskId: id,
      sharedWithId: shareDto.sharedWithId,
      permission: shareDto.permission,
    });

    return this.taskShareRepository.save(share);
  }

  async removeShare(
    taskId: string,
    shareId: string,
    userId: string,
  ): Promise<void> {
    const task = await this.findById(taskId, userId);

    if (task.ownerId !== userId) {
      throw new ForbiddenException(
        'Only owner can remove task shares',
      );
    }

    const share = await this.taskShareRepository.findOne({
      where: { id: shareId },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    await this.taskShareRepository.remove(share);
  }

  async getSharedUsers(id: string, userId: string) {
    const task = await this.findById(id, userId);

    if (task.ownerId !== userId) {
      throw new ForbiddenException(
        'Only owner can view shared users',
      );
    }

    return this.taskShareRepository.find({
      where: { taskId: id },
      relations: ['sharedWith'],
      select: {
        id: true,
        sharedWithId: true,
        permission: true,
        sharedAt: true,
        sharedWith: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
}
