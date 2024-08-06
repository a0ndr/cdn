import { Body, Controller, Delete, Get, HostParam, NotFoundException, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateKeyDto } from './dtos/createKey.dto';
import { KeyService } from './key.service';
import { AdminGuard } from './admin.guard';
import { KeyGuard } from './key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Request } from 'express';

@Controller({ host: process.env.MANAGEMENT_URI })
export class ManagementController {
    constructor(
        private keyService: KeyService,
        private fileService: FileService,
    ) {}
    
    @Post("createKey")
    @UseGuards(AdminGuard)
    async createKey(
        @Body() dto: CreateKeyDto,
    ) {
        return this.keyService.create(dto.note);
    }

    @Post("upload")
    @UseGuards(KeyGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Body() data) {
        return this.fileService.upload(req, file, data.origin, data.path ?? undefined);
    }

    @Get()
    @UseGuards(KeyGuard)
    @UseInterceptors(FileInterceptor('file'))
    async list(@Req() req: Request) {
        return this.fileService.list(req);
    }

    @Delete()
    @UseGuards(KeyGuard)
    async delete(@Req() req: Request, @Body("id") id: string) {
        return this.fileService.delete(req, id);
    }
}
