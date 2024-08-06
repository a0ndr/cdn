import { Body, Controller, Delete, Get, HostParam, NotFoundException, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateKeyDto } from './dtos/createKey.dto';
import { KeyService } from './key.service';
import { AdminGuard } from './admin.guard';
import { KeyGuard } from './key.guard';
import { FileService } from './file.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ host: ":host" })
export class FileController {
    constructor(
        private fileService: FileService,
    ) {}

    @Get("*")
    async find(@Req() req: Request, @Res() res: Response, @HostParam("host") host: string, @Query("size") size: string) {
        const path = req.path.replace("/", "");
        return this.fileService.show(req, res, host, path, size);
    }
}
