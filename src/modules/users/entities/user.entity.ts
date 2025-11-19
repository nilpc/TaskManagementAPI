import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { TaskShare } from '../../tasks/entities/task-share.entity';

@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];

  @OneToMany(() => TaskShare, (share) => share.sharedWith)
  sharedTasks: TaskShare[];
}
