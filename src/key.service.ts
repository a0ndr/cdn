import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiKey } from "./entities/key.entity";
import { Repository } from "typeorm";

@Injectable()
export class KeyService {
    constructor(@InjectRepository(ApiKey) private keys: Repository<ApiKey>) {}

    async create(note: string | undefined): Promise<ApiKey> {
        const key = this.keys.create();
        key.note = note ?? null;
        await this.keys.save(key);

        return key;
    }

    async findByKey(key: string) {
        return await this.keys.findOne({ where: { key } });
    }

    async remove(key: ApiKey): Promise<void> {
        await this.keys.remove(key);
    }
}
