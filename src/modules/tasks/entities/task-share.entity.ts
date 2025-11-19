import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';

@Entity('task_shares')
@Unique('unique_task_share', ['taskId', 'sharedWithId'])
@Index('idx_task_share_task', ['taskId'])
@Index('idx_task_share_user', ['sharedWithId'])
export class TaskShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @Column('uuid')
  sharedWithId: string;

  @Column({
    type: 'enum',
    enum: ['view', 'edit', 'admin'],
    default: 'view',
  })
  permission: 'view' | 'edit' | 'admin';

  @CreateDateColumn()
  sharedAt: Date;

  // Relations
  @ManyToOne(() => Task, (task) => task.shares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => User, (user) => user.sharedTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sharedWithId' })
  sharedWith: User;
}
