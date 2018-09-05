import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('url')
export class Url {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', name: 'short_url' })
  shortUrl: string;

  @Column({ type: 'bigint', name: 'created_at' })
  createdAt: number;

  constructor(id: string, url: string, shortUrl: string) {
    this.id = id;
    this.url = url;
    this.shortUrl = shortUrl;
  }
}