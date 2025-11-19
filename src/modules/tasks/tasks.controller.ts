import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, ShareTaskDto } from './dto/task.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.findById(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, user.id);
  }

  @Post(':id/share')
  shareTask(
    @Param('id') id: string,
    @Body() shareDto: ShareTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.shareTask(id, shareDto, user.id);
  }

  @Delete(':taskId/share/:shareId')
  removeShare(
    @Param('taskId') taskId: string,
    @Param('shareId') shareId: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.removeShare(taskId, shareId, user.id);
  }

  @Get(':id/shares')
  getSharedUsers(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.getSharedUsers(id, user.id);
  }
}
