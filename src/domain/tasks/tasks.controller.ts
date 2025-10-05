import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { AssignTaskDto } from './assign-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('assigned_to') assigned_to?: string,
  ) {
    return this.tasksService.findAll(
      status,
      assigned_to ? parseInt(assigned_to, 10) : undefined,
    );
  }

  @Post(':id/assign')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.tasksService.assign(id, assignTaskDto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.complete(id);
  }
}
