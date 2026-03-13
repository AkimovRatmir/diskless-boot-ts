import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { tarifs } from "src/db/schemas/tarifs";
import { CreateTarifDto } from "./dto/create-tarif.dto";
import { eq } from "drizzle-orm";
import { UpdateTarifDto } from "./dto/update-tarif.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class TarifService {
    constructor(
        @Inject('DRIZZLE_DB')
        private readonly db: NodePgDatabase,
    ) {}

    async createTarif(dto: CreateTarifDto) {
        const [created] = await this.db
            .insert(tarifs)
            .values(dto)
            .returning();
        return created;
    }

    async findAll() {
        return this.db.select().from(tarifs);
    }

    async findOne(id: number) {
        const [tarif] = await this.db
            .select()
            .from(tarifs)
            .where(eq(tarifs.id, id));

        if (!tarif) {
            throw new NotFoundException('Tarif not found');
        }

        return tarif;
    }

    async update(id: number, dto: UpdateTarifDto) {
            const [updated] = await this.db
            .update(tarifs)
            .set(dto)
            .where(eq(tarifs.id, id))
            .returning();

        if (!updated) {
            throw new NotFoundException('Tarif not found');
        }

        return updated;
    }

    async remove(id: number) {
        const deleted = await this.db
            .delete(tarifs)
            .where(eq(tarifs.id, id))
            .returning();

        if (deleted.length === 0) {
            throw new NotFoundException('Tarif not found');
        }

        return { message: 'Tarif deleted successfully' };
    }
}