import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  version?: number;
}

export class ShareTaskDto {
  @IsString()
  @IsNotEmpty()
  sharedWithId: string;

  @IsString()
  @IsNotEmpty()
  permission: 'view' | 'edit' | 'admin';
}

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  ownerId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
