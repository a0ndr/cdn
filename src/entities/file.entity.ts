import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiKey } from "./key.entity";
import { FileRequests } from "./request.entity";

@Entity()
export class HostedFile {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    path: string;

    @Column()
    filename: string;

    @Column()
    size: number;

    @Column()
    mime: string;

    @Column()
    origin: string;

    @ManyToOne(() => ApiKey, (key) => key.files, { cascade: true })
    key: ApiKey;

    @OneToMany(() => FileRequests, (requests) => requests.file)
    requests: FileRequests[];
}
