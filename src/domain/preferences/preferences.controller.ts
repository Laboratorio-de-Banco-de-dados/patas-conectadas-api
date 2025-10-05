import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { CreatePreferencesDto } from './create-preferences.dto';

@Controller('volunteers/:volunteerId/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
    @Body() createPreferencesDto: CreatePreferencesDto,
  ) {
    return this.preferencesService.create(volunteerId, createPreferencesDto);
  }

  @Get()
  findAll(@Param('volunteerId', ParseIntPipe) volunteerId: number) {
    return this.preferencesService.findAll(volunteerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.preferencesService.remove(volunteerId, id);
  }
}
