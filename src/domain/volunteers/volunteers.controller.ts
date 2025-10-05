import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { UpdateVolunteerDto } from './update-volunteer.dto';
import { TasksService } from '../tasks/tasks.service';

@Controller('volunteers')
export class VolunteersController {
  constructor(
    private readonly volunteersService: VolunteersService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.create(createVolunteerDto);
  }

  @Get()
  findAll() {
    return this.volunteersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.volunteersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteersService.update(id, updateVolunteerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.volunteersService.remove(id);
  }

  @Get(':id/tasks')
  getTasks(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findByVolunteer(id);
  }
}
