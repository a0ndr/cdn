import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiKey } from "./entities/key.entity";
import { Repository } from "typeorm";
import { HostedFile } from "./entities/file.entity";
import { Request, Response } from "express";
import { access, mkdir, readFile, rename, rm, stat } from "fs/promises";
import { constants, createReadStream, existsSync, writeFileSync } from "fs";
import gm from "gm";
import { FileRequests } from "./entities/request.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { KeyService } from "./key.service";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(HostedFile) private files: Repository<HostedFile>,
        @InjectRepository(FileRequests) private reqs: Repository<FileRequests>,
        private keys: KeyService
    ) {}

    async show(
        req: Request,
        res: Response,
        origin: string,
        path: string,
        size: string | undefined,
    ) {
        const p = `/app/files/${origin}/${path}`;
        try {
            const st = await stat(p);
            if (st.isDirectory() || !st.isFile()) throw new NotFoundException();

            const r = this.reqs.create();
            r.origin = req.ip;
            r.referrer = req.headers.referer;
            r.file = await this.files.findOne({ where: { path: p } });

            if (size) {
                const t = `/app/files/temp/${path.replace("/", "_")}-${origin.replace(".", "_")}-${size}.${path.split(".").pop()}`;

                if (existsSync(t)) {
                    const s = createReadStream(t);
                    s.pipe(res);
                } else {
                    if (!existsSync("/app/files/temp")) {
                        await mkdir("/app/files/temp");
                    }

                    gm(p)
                        .resize(
                            parseInt(size.split("x")[0]),
                            parseInt(size.split("x")[1]),
                            "!",
                        )
                        .noProfile()
                        .write(t, (err) => {
                            if (err) {
                                console.log(err);
                                throw new Error();
                            }
                            const s = createReadStream(t);
                            s.pipe(res);
                        });
                }
            } else {
                const s = createReadStream(p);
                s.pipe(res);
            }
            await this.reqs.save(r);
        } catch {
            throw new NotFoundException();
        }
    }

    async upload(
        req: Request,
        file: Express.Multer.File,
        origin: string,
        path: string | undefined = undefined,
    ) {
        const _path = `/app/files/${origin}${path ? "/" + path : ""}`;
        if (!existsSync(_path)) {
            await mkdir(_path, { recursive: true });
        }

        writeFileSync(_path + `/${file.originalname}`, file.buffer);

        const entity = this.files.create();
        entity.key = req["key"];
        entity.origin = origin;
        entity.path = _path + `/${file.originalname}`;
        entity.filename = file.originalname;
        entity.size = file.size;
        entity.mime = file.mimetype;
        await this.files.save(entity);

        delete entity.path;
        return {...entity, url: `https://${origin}${path ? "/" + path : ""}/${file.originalname}`};
    }

    async delete(req: Request, id: string) {
        const e = await this.files.findOne({ where: { id, key: req['key'] } });
        if (!e) throw new NotFoundException("File not found");

        await rename(e.path, e.path + `-${e.id}-${new Date().toISOString()}-DELETED`);
        await this.files.remove(e);
        
        delete e.path;
        return e;
    }

    async list(req: Request) {
        const e = await this.files.find({ where: { key: req['key'] }, select: { path: false } });
        let n: HostedFile[] = [];
        for (const [_, f] of Object.entries(e)) {
            delete f.path;
            n.push(f);
        }
        return n;
    }
}
