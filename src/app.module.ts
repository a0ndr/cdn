import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HostedFile } from "./entities/file.entity";
import { ApiKey } from "./entities/key.entity";
import { KeyService } from "./key.service";
import { ManagementController } from './management.controller';
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { FileRequests } from "./entities/request.entity";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT) ?? 5432,
            username: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_NAME,
            entities: [HostedFile, ApiKey, FileRequests],
            synchronize: true
        }),
        TypeOrmModule.forFeature([HostedFile, ApiKey, FileRequests])
    ],
    controllers: [ManagementController, FileController],
    providers: [FileService, KeyService],
})
export class AppModule {}
