import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiKey } from "./key.entity";
import { HostedFile } from "./file.entity";

@Entity()
export class FileRequests {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "timestamp" })
    created_at: Date = new Date();

    @Column()
    origin: string;

    @Column({ nullable: true })
    referrer: string;

    @ManyToOne(() => HostedFile, (file) => file.requests, { cascade: true })
    file: HostedFile;
}
