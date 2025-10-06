import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { CreatePreferenceDto } from './create-preference.dto';

@Controller('volunteers/:volunteerId/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
    @Body() createPreferenceDto: CreatePreferenceDto,
  ) {
    return this.preferencesService.create(volunteerId, createPreferenceDto);
  }

  @Get()
  findAll(@Param('volunteerId', ParseIntPipe) volunteerId: number) {
    return this.preferencesService.findAll(volunteerId);
  }

  @Delete(':prefId')
  remove(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
    @Param('prefId', ParseIntPipe) prefId: number,
  ) {
    return this.preferencesService.remove(volunteerId, prefId);
  }
}
