import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { KeyService } from "./key.service";

@Injectable()
export class KeyGuard implements CanActivate {
    constructor(private keys: KeyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();

        const header = req.header("X-Api-Key");
        if (!header) throw new UnauthorizedException();

        const key = await this.keys.findByKey(header);
        if (!key) throw new UnauthorizedException();

        req['key'] = key;
        return true;
    }
}
