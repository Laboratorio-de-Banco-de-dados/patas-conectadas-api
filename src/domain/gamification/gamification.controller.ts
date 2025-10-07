import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { CreateGamificationDto } from './create-gamification.dto';
import { UpdateGamificationDto } from './update-gamification.dto';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get()
  findAll() {
    return this.gamificationService.findAll();
  }

  @Get('ranking')
  getRanking() {
    return this.gamificationService.getRanking();
  }

  @Get('volunteer/:volunteerId')
  getVolunteerPoints(@Param('volunteerId', ParseIntPipe) volunteerId: number) {
    return this.gamificationService.getVolunteerPoints(volunteerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamificationService.findOne(id);
  }

  @Post()
  create(@Body() createGamificationDto: CreateGamificationDto) {
    return this.gamificationService.create(createGamificationDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGamificationDto: UpdateGamificationDto,
  ) {
    return this.gamificationService.update(id, updateGamificationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamificationService.remove(id);
  }
}
