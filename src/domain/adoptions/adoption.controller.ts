import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdoptionsService } from './adoption.service';
import { CreateAdoptionDto } from './create-adoption.dto';
import { UpdateAdoptionDto } from './update-adoption.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Get()
  findAll() {
    return this.adoptionsService.findAll();
  }

  @Get('reports/annual')
  getAnnualReport(@Query('year', ParseIntPipe) year: number) {
    return this.adoptionsService.getAnnualReport(year);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionsService.findOne(id);
  }

  @Post()
  create(@Body() createAdoptionDto: CreateAdoptionDto) {
    return this.adoptionsService.create(createAdoptionDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdoptionDto: UpdateAdoptionDto,
  ) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adoptionsService.remove(id);
  }
}
