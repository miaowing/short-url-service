import { EntityRepository, Repository } from 'typeorm';
import { Url } from '../domains';

@EntityRepository(Url)
export class UrlRepository extends Repository<Url> {
    findUrlById(id: string): Promise<Url> {
        return this.findOne({ where: { id } });
    }

    findUrlByAddress(url: string) {
        return this.findOne({ where: { url } });
    }
}