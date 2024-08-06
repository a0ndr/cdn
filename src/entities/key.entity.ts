import {
    Column,
    Entity,
    Generated,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { HostedFile } from "./file.entity";

@Entity()
export class ApiKey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    key: string;

    @Column({ nullable: true })
    note: string;

    @OneToMany(() => HostedFile, (file) => file.key)
    files: HostedFile[];
}
